
# Load Testing

1.  Install necessary prerequisites
   - sudo apt install -y python3
   - python3 -m pip install --user --upgrade pip
   - python3 -m pip install --user virtualenv
1.  Create a new virtual environment
   ```
   python3 -m virtualenv --python=python3 load-env
   ```
1.  Activate the new virtual environment
   ```
   source load-env/bin/activate
   ```
1.  Install, into the new virtual environment, the required python modules
   ```
   python3 -m pip install -r requirements.txt
   ```
1.  Start locust by running:
   ```
   locust  
   ```
1.  On the current machine use a web browser to navigate to http://localhost:8089/ to begin the test.

