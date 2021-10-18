
from locust import HttpUser, task, events
import urllib.parse
from bs4 import BeautifulSoup
import re
import logging

@events.init_command_line_parser.add_listener
def _(parser):
    parser.add_argument("--studio-code-org-domain", type=str, env_var="STUDIO_CODE_ORG_DOMAIN", default="studio.code.org", help="The domain name used to save the Level 10 code.")

@events.test_start.add_listener
def _(environment, **kw):
    logging.info("Custom argument supplied: %s" % environment.parsed_options.studio_code_org_domain)

# Huge simplification here, I am hard coding the credentials for a single user here.
# Also, I have not (yet) learned what the hash function they are applying for
# the 'user[hashed_email]' field actually is.  Once I move to a more
# data-driven mechanism (or even a dynamic user creation mechanism) then I will
# need to dig into the details of how the hash is constructed.
hashed_email = "1edb267384ecf3db9cc3e548e2c59108" 
email = "foo@domain.com"
password = "sillypassword"

class DancePartyUser(HttpUser):
    @task
    def do_dance_party(self):
        self.confirm_logged_in_via_root()
        self.dance_party_level(1)
        self.dance_party_level(2)

    def confirm_logged_in_via_root(self):
        # This is a sanity check and, like all HTML parsing, a little fragile.  
        # This requests the 'home' page and looks for a 'my-projects' element 
        # within the page.  A logged in user always has an element that looks 
        # like this:
        #    <a class="linktag" href="//localhost-studio.code.org:3000/projects" id="my-projects">My projects</a>
        # When they are recognized.  
        #
        # This is fragile because if we ever remove this link or change the name 
        # then we will get a false negative. 
        with self.client.get("/home", catch_response=True) as response:
            soup = BeautifulSoup(response.text, features="html.parser")
            my_projects = soup.find_all(id = "my-projects")
            if not my_projects:
                logging.error("cdo::Something this wrong, we are not logged it!")
                logging.debug("cdo::Fragile response where we were looking for a 'my-projects' element: {}\n".format(response.text))
                response.failure("Not logged in")

    def dance_party_level(self, level):
        url = "/s/dance-2019/lessons/1/levels/{level}".format(lesson=level, level=level)
        callback_url = None
        resource_identifier = None
        with self.client.get(url, catch_response=True) as response:
            if response.status_code != 200:
                logging.error("cdo::Got back an unexpected status code for initial level get: {}".format(response.status_code))
                logging.debug("cdo::Full response: {}\n".format(response.text))
                response.failure("Couldn't issue level GET request")
                return False

            # Within the response is a javascript component that includes a callback that is used 
            # to report the results of the level.  Unfortunately this exists only within javascript so it
            # is not readily available through more structured processing of the page.  So instead
            # we pick it out from the content looking for the following general form:
            # 
            #     "callback":"[url]"
            # 
            match = re.search('"callback":"([^"]*)"', response.text)
            if not match:
                logging.error("cdo::Could not find callback URL for level {}".format(level))
                logging.debug("cdo::very fragile response where we were looking for callback url in javascript; response: {}".format(response.text))
                response.failure("Couldn't find callback URL")
                return False

            callback_url = match.group(1)

            # Also within the response, but only for level 10, is a resource identifier that we will 
            # need for a specific call that occurs for that level.  
            if level == 10:
                match = re.search('dance-api.code.org/source/([^?]*)?', response.text)
                if not match:
                    logging.error("cdo::Could not find resource identifier for level 10")
                    logging.debug("cdo::very fragile response where we were looking for resource id in javascript; response: {}".format(response.text))
                    response.failure("Couldn't find resource identifier")
                    return False

                resource_identifier = match.group(1)
   
        # There are two cases here.  Either the customer is playing level 1-9
        # or level 10.  Level 10 differs in metrics that are gathered and also
        # the program that the customer is running is saved to a resource
        # identifier each time that the program is run.  Presumably this is
        # saved in AWS somewhere. 
        if level == 10:
            # The PUT is made to a different domain and this doesn't work in test environments so
            # my ability to test this code is zero.  But a rough first pass is as follows.

            url = "https://{domain}/v3/sources/{res}/main.json".format(domain=self.environment.parsed_options.my_argument, res=resource_identifier)
            params = { 
                    'currentVersion': 'unknown',
                    "replace": "false", 
                    "firstSaveTimestamp": "2021-10-17T15:17:14.711+00:00", 
                    "tabId": "0.8278581607861322" }

            # Example program.
            payload = '{"source":"<xml><block type=\"Dancelab_whenSetup\" movable=\"false\"><statement name=\"DO\"><block type=\"Dancelab_setBackgroundEffectWithPalette\"><title name=\"PALETTE\">\"electronic\"</title><title name=\"EFFECT\">\"spiral\"</title><next><block type=\"Dancelab_makeNewDanceSpriteGroup\"><title name=\"N\">4</title><title name=\"COSTUME\">\"ALIEN\"</title><title name=\"LAYOUT\">\"circle\"</title><next><block type=\"Dancelab_makeAnonymousDanceSprite\"><title name=\"COSTUME\">\"MOOSE\"</title><title name=\"LOCATION\">{x: 200, y: 200}</title></block></next></block></next></block></statement></block><block type=\"Dancelab_everySeconds\"><title name=\"N\">4</title><title name=\"UNIT\">\"measures\"</title><statement name=\"DO\"><block type=\"Dancelab_changePropEachBy\"><title name=\"GROUP\">\"MOOSE\"</title><title name=\"PROPERTY\">\"scale\"</title><title name=\"VAL\">-1</title><next><block type=\"Dancelab_setForegroundEffectExtended\"><title name=\"EFFECT\">\"rain\"</title></block></next></block></statement></block></xml>","animations":{},"selectedSong":"ificanthaveyou_shawnmendes"}'
            byte_payload = bytes(payload, 'utf-8')

            with self.client.request(
                    method='PUT',
                    url=url,
                    params=params,
                    catch_response=True,
                    data=byte_payload) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    logging.error("cdo::Putting program and got back an unexpected status code: {} for url: {}".format(response.status_code, url))
                    logging.debug("cdo::Response: {}\n".format(response.text))

        # For all levels each time that the program is 'completed' (either by
        # the user hitting the reset button or automatically by the client
        # which is looking for success criteria) then there is a POST to record
        # the result of running the user's program.
        #
        # It is always URL Encoded data that looks something like:
        #
	# "app": "dance",
	# "level": "custom",
	# "time": "61673",
	# "timeSinceLastMilestone": "61673",
	# "lines": "2",
	# "attempt": "1"
        #
        # For example:  app=dance&level=custom&time=61673&timeSinceLastMilestone=61673&lines=2&attempt=1
        # 
        # I should see a 200 response.  Within our DB a new record in the activities table will be created.
        params = { 
                'app': 'dance',
                "level": "custom", 
                "time": "1000", 
                "timeSinceLastMilestone": "1000", 
                "lines": "2",
                "attempt": "1" }
        headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36' 
                }

        params_encoded = urllib.parse.urlencode(params)
        byte_message = bytes(params_encoded, 'utf-8')
        with self.client.request(
                method='POST',
                url=callback_url,
                catch_response=True,
                headers=headers,
                data=byte_message) as response:
            if response.status_code == 200:
                response.success()
            else:
                logging.error("cdo::Got back an unexpected status code: {} for callback_url: {}".format(response.status_code, callback_url))
                logging.debug("cdo::Response: {}\n".format(response.text))


    def on_start(self):
        # The login process consists of two steps.  First we do a GET request for 
        #
        #  /users/sign_in.  
        #
        # There are two important parts to this.  First we are assigned a
        # 'learn_session_development' cookie.  The Locust framework will
        # automatically carry all cookies forward to all requests.  This 
        # cookie value is unique and important.
        #
        # Second there is an input form in the response to sign in that includes
        # a hidden form field for an element 'authenticity_token' which must
        # be included in the POST response.  This is also uniquely generated.
        # If you omit this then Ruby will complain loudly. 
        # 
        # The code below makes the assumption that the very first 
        # hidden form field named 'authenticity_token' is the proper 
        # value to include in the POST request.  There appear to be 
        # multiple hidden form fields in later forms on the same page
        # so this assumption is brittle and it makes me sad.  But until/unless
        # I learn more I will go with this.
        #
        # In the second step to the login we encode the data in the POST
        # request to 'sign_in'.  The payload for the POST request is the bytes
        # representation of URL encoded parameters present in the form.  
        authenticity_token = None
        with self.client.request( method='GET', url='/users/sign_in', catch_response=True) as response:
            if response.status_code != 200:
                logging.error("cdo::Got back an unexpected status code: {}".format(response.status_code))
                logging.debug("cdo::Full response: {}\n".format(response.text))
                response.failure("Couldn't issue initial GET request")
                return

            # Extract the authenticity_token.  Again the assumption here is that it is the first 
            # hidden input form field whose name is 'authenticity_token'.
            soup = BeautifulSoup(response.text, features="html.parser")
            hidden_tags = soup.find_all("input", type="hidden")
            for tag in hidden_tags:
                if tag.get('name') == 'authenticity_token':
                    authenticity_token = tag.get('value')
                    break

            if not authenticity_token:
                logging.error("cdo::Unable to find the authenticity token;")
                logging.debug("cdo::fragile response where we were looking for a hidden 'authenticity_token' input field: {}".format(response.text))
                response.failure("Unable to find authenticity token")
                return

            response.success()

        params = { 'utf8': '✓', 
            "authenticity_token": authenticity_token, 
            "user[hashed_email]": hashed_email,
            "user[login]": email, 
            "user[password]": password }
        headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36' 
                }

        params_encoded = urllib.parse.urlencode(params)
        byte_message = bytes(params_encoded, 'utf-8')
        with self.client.request(
                method='POST',
                url='/users/sign_in', 
                catch_response=True,
                headers=headers,
                data=byte_message) as response:
            if response.status_code == 200:
                response.success()
            else:
                logging.error("cdo::Got back an unexpected status code: {}".format(response.status_code))
                logging.debug("cdo::Response: {}\n".format(response.text))

