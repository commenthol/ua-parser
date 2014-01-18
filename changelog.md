# Changelog

## 2014-01-xx

**regexes.yaml**

- improvements
  - MOZILLA FIREBIRD is not from brand Bird

## 2014-01-18

**regexes.yaml**

- improvements 
  - os: Windows XP hides Windows Phone 6; Windows Phone OS/; Opera Mini Bada; WindowsCE not detected for Fennec;
  - device: Haier[ _\-]; new HTC Desire models; IconBit NT; Mobistel Cynus; Mobiistar is not a POV brand; Generic_Android matcher; Nokia UCBrowser; Nokia XpressMusic strip SN number; Samsung- matcher;
  - strip trailing spaces
- new 
  - device: Sony SmartWatch; WeTab;

## 2014-01-14

**regexes.yaml**

- Merge pull request #325 from epgrubmair/mail_clients_1
  Airmail,Outlook,Thunderbird new. Lightning updated

## 2014-01-11

**regexes.yaml**

- improvements 
  - Advent Vega, Alcatel One Touch with ",", Blue Tank 4.5, Medion Lifetab, Pomp, Samsung Galaxy S*, ZTE RACERII fix: CobyKyros MID
- new 
  - models: Alcatel One Touch, GoClever QUANTUM, Haier
  - brands: Gfive, Lexibook, Omega

## 2014-01-08

**regexes.yaml**

- new
  - Google Glass added

## 2014-01-07

**regexes.yaml**

- improvements 
  - better android matchers if "Build" occurs twice; Generic Smart Phone matcher
- refactored
  - LG matchers; Generic Android Matchers now resolves brand to "Generic_Android"
- new 
  - models: Acer, Alcatel, Aoson, Arnova, Asus, Blaupunkt, Blu, Casio, Celkon, Cloudfone, Cmx, HTC, Hyundai, Intex, Karbonn, Lenovo, MSI, Nook, Odys, POV, Samsung, Softbank, Terra, Thalia, Thl, Toshiba, Treq, Wiko, Woxter, Yarvik, Xoro, Zopo, ZTE, Hero, HTC Windows Phones, Internet TV Sets, Generic_Inettv, microsoft, Android on Blackberry
  - brand: Airis, Axioo, Cubot, Denver, DNS AirTab, DOOV, Evercoss, Gionee, HCLme, hitech, iBall, IMO, Infinix, Informer, Jaytech, JXD, Kingcom, Lava, Lemon, Mito, Modecom, Multilaser, MyPhone, Papayre, Pipo, Ployer, Pomp, Skytex, Tooky, Videocon, vivo, Walton, Google TV, Generic Tablet
- changes
  - brand renamed: Hanns is now Hannspree
  - brand removed: Technicolor: doubled - now part of Telstra 

## 2013-11-22

**regexes.yaml**

user_agent_parsers:

- Bingbot PR#311 added

device_parsers:

- Bingbot PR#311 added (detection was already present; added for completness)
- More Android brands and models 
- Improvements to previous device detection for some devices

## 2013-11-15

**php**

- Modernize PHP port of User Agent Parser from @lstrojny 
- brand model device parsing with case insensitive testing

## 2013-11-14

**regexes.yaml**

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

**Testcases**

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

**py**

- Python Parser updated according to spec. $1 replacement in OSParser for os.family considered.

**perl**

- Perl Parser updated; Speed optimizations using precompiled regexes;
