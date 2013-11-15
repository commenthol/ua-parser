# Changelog

## 2013-11-15

### `php`

- Modernize PHP port of User Agent Parser from @lstrojny 
- brand model device parsing with case insensitive testing

## 2013-11-14

### `regexes.yaml`

user_agent_parsers:

- Vodafone browser removed and corrected to Openwave

os_parsers:

- Android matchers simplified
- os detection within UCWEB and JUC browsers
- Windows ME matcher case corrected
- Windows 8.1 added and changed to 8.1 PR#292
- Firefox OS Matcher rewritten
- Mozilla WinXX matchers added
- Improved detection of iOS
- Match of GoogleTV patch version
- Detection of gentoo and Linux Kernel Version

device_parsers:

- Complete rewrite of Brand Model matchers for Android and Windows Phones
- Kindle Fire HDX added PR#303
- Detection of Kindle Reader
- Brand Model recognized for Sony PalmOS devices
- FireFoxOS devices added (Alcatel One Touch 4012X, ZTE Open)
- Detection of Siemens and SonyEricsson Feature Phones
- Detection of Generic Tablets
- Spider detection for GoogleBots changed to match before Android and iOS

### Testcases

`test_user_agent_parser.yaml`

- New tests added to cover regex changes
- Testcases corrected

`test_user_agent_parser_os.yaml` 

- New tests added to cover regex changes
- Testcases corrected

`test_device.yaml`

- New tests added to cover the rewrite
- Testcases corrected, doubled testcases with same user-agent string removed
- Corrupted User-Agents added in previous PR removed

### `py`

- Python Parser updated according to spec. $1 replacement in OSParser for os.family considered.

### `perl`

- Perl Parser updated; Speed optimizations using precompiled regexes;
