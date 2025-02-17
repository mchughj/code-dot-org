# coding: utf-8
require 'sort_alphabetical'
require_relative 'country_regions'

# coding: utf-8
COUNTRY_CODE_TO_COUNTRY_NAME = {
  "AD" => "Andorra",
  "AE" => "United Arab Emirates",
  "AF" => "Afghanistan",
  "AG" => "Antigua and Barbuda",
  "AI" => "Anguilla",
  "AL" => "Albania",
  "AM" => "Armenia",
  "AO" => "Angola",
  "AQ" => "Antarctica",
  "AR" => "Argentina",
  "AS" => "American Samoa",
  "AT" => "Austria",
  "AU" => "Australia",
  "AW" => "Aruba",
  "AX" => "Åland Islands",
  "AZ" => "Azerbaijan",
  "BA" => "Bosnia and Herzegovina",
  "BB" => "Barbados",
  "BD" => "Bangladesh",
  "BE" => "Belgium",
  "BF" => "Burkina Faso",
  "BG" => "Bulgaria",
  "BH" => "Bahrain",
  "BI" => "Burundi",
  "BJ" => "Benin",
  "BL" => "Saint Barthélemy",
  "BM" => "Bermuda",
  "BN" => "Brunei",
  "BO" => "Plurinational State of Bolivia",
  "BQ" => "Bonaire",
  "BR" => "Brazil",
  "BS" => "Bahamas",
  "BT" => "Bhutan",
  "BV" => "Bouvet Island",
  "BW" => "Botswana",
  "BY" => "Belarus",
  "BZ" => "Belize",
  "CA" => "Canada",
  "CC" => "Cocos (Keeling) Islands",
  "CD" => "Democratic Republic of Congo",
  "CF" => "Central African Republic",
  "CG" => "Congo",
  "CH" => "Switzerland",
  "CI" => "Côte d'Ivoire",
  "CK" => "Cook Islands",
  "CL" => "Chile",
  "CM" => "Cameroon",
  "CN" => "China",
  "CO" => "Colombia",
  "CR" => "Costa Rica",
  "CU" => "Cuba",
  "CV" => "Cape Verde",
  "CW" => "Curaçao",
  "CX" => "Christmas Island",
  "CY" => "Cyprus",
  "CZ" => "Czech Republic",
  "DE" => "Germany",
  "DJ" => "Djibouti",
  "DK" => "Denmark",
  "DM" => "Dominica",
  "DO" => "Dominican Republic",
  "DZ" => "Algeria",
  "EC" => "Ecuador",
  "EE" => "Estonia",
  "EG" => "Egypt",
  "EH" => "Western Sahara",
  "ER" => "Eritrea",
  "ES" => "Spain",
  "ET" => "Ethiopia",
  "FI" => "Finland",
  "FJ" => "Fiji",
  "FK" => "Falkland Islands (Malvinas)",
  "FM" => "Micronesia",
  "FO" => "Faroe Islands",
  "FR" => "France",
  "GA" => "Gabon",
  "GB" => "United Kingdom",
  "GD" => "Grenada",
  "GE" => "Georgia",
  "GF" => "French Guiana",
  "GG" => "Guernsey",
  "GH" => "Ghana",
  "GI" => "Gibraltar",
  "GL" => "Greenland",
  "GM" => "Gambia",
  "GN" => "Guinea",
  "GP" => "Guadeloupe",
  "GQ" => "Equatorial Guinea",
  "GR" => "Greece",
  "GS" => "South Georgia and the South Sandwich Islands",
  "GT" => "Guatemala",
  "GU" => "Guam",
  "GW" => "Guinea-Bissau",
  "GY" => "Guyana",
  "HK" => "Hong Kong",
  "HM" => "Heard Island and McDonald Islands",
  "HN" => "Honduras",
  "HR" => "Croatia",
  "HT" => "Haiti",
  "HU" => "Hungary",
  "ID" => "Indonesia",
  "IE" => "Ireland",
  "IL" => "Israel",
  "IM" => "Isle of Man",
  "IN" => "India",
  "IO" => "British Indian Ocean Territory",
  "IQ" => "Iraq",
  "IR" => "Islamic Republic of Iran",
  "IS" => "Iceland",
  "IT" => "Italy",
  "JE" => "Jersey",
  "JM" => "Jamaica",
  "JO" => "Jordan",
  "JP" => "Japan",
  "KE" => "Kenya",
  "KG" => "Kyrgyzstan",
  "KH" => "Cambodia",
  "KI" => "Kiribati",
  "KM" => "Comoros",
  "KN" => "Saint Kitts and Nevis",
  "KP" => "Democratic People's Republic of Korea",
  "KR" => "Republic of Korea",
  "KW" => "Kuwait",
  "KY" => "Cayman Islands",
  "KZ" => "Kazakhstan",
  "LA" => "Lao People's Democratic Republic",
  "LB" => "Lebanon",
  "LC" => "Saint Lucia",
  "LI" => "Liechtenstein",
  "LK" => "Sri Lanka",
  "LR" => "Liberia",
  "LS" => "Lesotho",
  "LT" => "Lithuania",
  "LU" => "Luxembourg",
  "LV" => "Latvia",
  "LY" => "Libya",
  "MA" => "Morocco",
  "MC" => "Monaco",
  "MD" => "Moldova",
  "ME" => "Montenegro",
  "MG" => "Madagascar",
  "MH" => "Marshall Islands",
  "MK" => "Republic of Macedonia",
  "ML" => "Mali",
  "MM" => "Myanmar",
  "MN" => "Mongolia",
  "MO" => "Macao",
  "MP" => "Northern Mariana Islands",
  "MQ" => "Martinique",
  "MR" => "Mauritania",
  "MS" => "Montserrat",
  "MT" => "Malta",
  "MU" => "Mauritius",
  "MV" => "Maldives",
  "MW" => "Malawi",
  "MX" => "Mexico",
  "MY" => "Malaysia",
  "MZ" => "Mozambique",
  "NA" => "Namibia",
  "NC" => "New Caledonia",
  "NE" => "Niger",
  "NF" => "Norfolk Island",
  "NG" => "Nigeria",
  "NI" => "Nicaragua",
  "NL" => "Netherlands",
  "NO" => "Norway",
  "NP" => "Nepal",
  "NR" => "Nauru",
  "NU" => "Niue",
  "NZ" => "New Zealand",
  "OM" => "Oman",
  "PA" => "Panama",
  "PE" => "Peru",
  "PF" => "French Polynesia",
  "PG" => "Papua New Guinea",
  "PH" => "Philippines",
  "PK" => "Pakistan",
  "PL" => "Poland",
  "PM" => "Saint Pierre and Miquelon",
  "PN" => "Pitcairn",
  "PR" => "Puerto Rico",
  "PS" => "Palestine",
  "PT" => "Portugal",
  "PW" => "Palau",
  "PY" => "Paraguay",
  "QA" => "Qatar",
  "RE" => "Réunion",
  "RO" => "Romania",
  "RS" => "Serbia",
  "RU" => "Russian Federation",
  "RW" => "Rwanda",
  "SA" => "Saudi Arabia",
  "SB" => "Solomon Islands",
  "SC" => "Seychelles",
  "SD" => "Sudan",
  "SE" => "Sweden",
  "SG" => "Singapore",
  "SI" => "Slovenia",
  "SJ" => "Svalbard and Jan Mayen",
  "SK" => "Slovakia",
  "SL" => "Sierra Leone",
  "SM" => "San Marino",
  "SN" => "Senegal",
  "SO" => "Somalia",
  "SR" => "Suriname",
  "SS" => "South Sudan",
  "ST" => "Sao Tome and Principe",
  "SV" => "El Salvador",
  "SX" => "Sint Maarten (Dutch part)",
  "SY" => "Syrian Arab Republic",
  "SZ" => "Swaziland",
  "TC" => "Turks and Caicos Islands",
  "TD" => "Chad",
  "TG" => "Togo",
  "TH" => "Thailand",
  "TJ" => "Tajikistan",
  "TK" => "Tokelau",
  "TL" => "Timor-Leste",
  "TM" => "Turkmenistan",
  "TN" => "Tunisia",
  "TO" => "Tonga",
  "TR" => "Turkey",
  "TT" => "Trinidad and Tobago",
  "TV" => "Tuvalu",
  "TW" => "Taiwan",
  "TZ" => "Tanzania",
  "UA" => "Ukraine",
  "UG" => "Uganda",
  "US" => "United States",
  "UY" => "Uruguay",
  "UZ" => "Uzbekistan",
  "VA" => "Holy See (Vatican City State)",
  "VC" => "Saint Vincent and the Grenadines",
  "VE" => "Bolivarian Republic of Venezuela",
  "VG" => "Virgin Islands, British",
  "VI" => "Virgin Islands, U.S.",
  "VN" => "Viet Nam",
  "VU" => "Vanuatu",
  "WF" => "Wallis and Futuna",
  "WS" => "Samoa",
  "XK" => "Kosovo",
  "YE" => "Yemen",
  "YT" => "Mayotte",
  "ZA" => "South Africa",
  "ZM" => "Zambia",
  "ZW" => "Zimbabwe",
}.freeze

# ISO 3166 alpha-2 country codes for Member States of the European Union.
# Source: http://publications.europa.eu/code/pdf/370000en.htm
# ISO codes for Greece (GR) and United Kingdom (GB) are listed instead of their recommended abbreviations (EL and UK).
EU_COUNTRY_CODES = %w(
  AT
  BE
  BG
  CY
  CZ
  DE
  DK
  EE
  ES
  FI
  FR
  GB
  GR
  HR
  HU
  IE
  IT
  LT
  LU
  LV
  MT
  NL
  PL
  PT
  RO
  SE
  SI
  SK
).freeze

# EEA = EU + Iceland, Liechtenstein and Norway.
EEA_COUNTRY_CODES = EU_COUNTRY_CODES +
  %w(
    IS
    LI
    NO
  )

LATAM_COUNTRY_CODES = LATAM_ES_COUNTRY_CODES + LATAM_PT_COUNTRY_CODES

# Returns the name of the country whose two character country code is code.
# If code is not a valid two character country code, returns code.
def country_name_from_code(code)
  return COUNTRY_CODE_TO_COUNTRY_NAME[code.to_s.strip.upcase] || code
end

# Returns the entire list of countries
def get_all_countries
  return COUNTRY_CODE_TO_COUNTRY_NAME.sort_alphabetical_by {|_code, name| name}
end

def valid_country_code?(code)
  return COUNTRY_CODE_TO_COUNTRY_NAME[code.to_s.strip.upcase].present?
end

# @return true if the provided alpha-2 country code represents a
# member state of the European Union covered by the GDPR.
def gdpr_country_code?(code)
  return false if code.nil?
  EEA_COUNTRY_CODES.include?(code.to_s.strip.upcase)
end

def latam_country_code?(code)
  LATAM_COUNTRY_CODES.include? code.to_s.strip.upcase
end
