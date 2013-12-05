<?php
/**
 * ua-parser
 *
 * Copyright (c) 2011-2012 Dave Olsen, http://dmolsen.com
 *
 * Released under the MIT license
 */
namespace UAParser;

use stdClass;
use UAParser\Exception\FileNotFoundException;
use UAParser\Result\Device;
use UAParser\Result\OperatingSystem;
use UAParser\Result\Client;
use UAParser\Result\UserAgent;

class Parser
{
    /** @var string */
    public static $defaultFile;

    /** @var stdClass */
    protected $regexes;

    /**
     * Start up the parser by importing the json file to $this->regexes
     *
     * @param string $customRegexesFile
     * @throws FileNotFoundException
     */
    public function __construct($customRegexesFile = null)
    {
        $regexesFile = $customRegexesFile !== null ? $customRegexesFile : static::getDefaultFile();
        if (file_exists($regexesFile)) {
            $this->regexes = json_decode(file_get_contents($regexesFile));
        } else {
            if ($customRegexesFile !== null) {
                throw FileNotFoundException::customRegexFileNotFound($regexesFile);
            } else {
                throw FileNotFoundException::defaultFileNotFound(static::getDefaultFile());
            }
        }
    }

    /**
     * Sets up some standard variables as well as starts the user agent parsing process
     *
     * @param string $ua a user agent string to test, defaults to an empty string
     * @param array $jsParseBits
     * @return Client
     */
    public function parse($ua, array $jsParseBits = array())
    {
        $result = new Client($ua);

        $result->ua = $this->parseUserAgent($ua, $jsParseBits);
        $result->os = $this->parseOperatingSystem($ua);
        $result->device = $this->parseDevice($ua);

        return $result;
    }

    /**
     * Attempts to see if the user agent matches a user_agents_parsers regex from regexes.json
     *
     * @param string $uaString a user agent string to test
     * @param array $jsParseBits
     * @return UserAgent
     */
    private function parseUserAgent($uaString, array $jsParseBits = array())
    {
        $ua = new UserAgent();

        list($regex, $matches) = $this->matchRegexes(
            $this->regexes->user_agent_parsers,
            $uaString,
            array(
                1 => 'Other',
                2 => null,
                3 => null,
                4 => null,
            )
        );

        if ($matches) {
            $ua->family = $this->replaceString($regex, 'family_replacement', $matches[1]);
            $ua->major = isset($regex->v1_replacement) ? $regex->v1_replacement : $matches[2];
            $ua->minor = isset($regex->v2_replacement) ? $regex->v2_replacement : $matches[3];
            $ua->patch = isset($regex->v3_replacement) ? $regex->v3_replacement : $matches[4];
        }

        return $ua;
    }

    /**
     * Attempts to see if the user agent matches an os_parsers regex from regexes.json
     *
     * @param string $uaString a user agent string to test
     * @return OperatingSystem
     */
    private function parseOperatingSystem($uaString)
    {
        $os = new OperatingSystem();

        list($regex, $matches) = $this->matchRegexes(
            $this->regexes->os_parsers,
            $uaString,
            array(
                1 => 'Other',
                2 => null,
                3 => null,
                4 => null,
                5 => null,
            )
        );

        if ($matches) {
            $os->family = $this->replaceString($regex, 'os_replacement', $matches[1]);
            $os->major = isset($regex->os_v1_replacement) ? $regex->os_v1_replacement : $matches[2];
            $os->minor = isset($regex->os_v2_replacement) ? $regex->os_v2_replacement : $matches[3];
            $os->patch = isset($regex->os_v3_replacement) ? $regex->os_v3_replacement : $matches[4];
            $os->patchMinor = isset($regex->os_v4_replacement) ? $regex->os_v4_replacement : $matches[5];
        }

        return $os;
    }

    /**
     * Attempts to see if the user agent matches a device_parsers regex from regexes.json
     * @param string $uaString a user agent string to test
     * @return Device
     */
    private function parseDevice($uaString)
    {
        $device = new Device();

        list($regex, $matches) = $this->matchRegexes($this->regexes->device_parsers, $uaString, 
          array(1 => 'Other', 2 => null, 3 => null));

        if ($matches) {
            $device->family = $this->multiReplace($regex, 'device_replacement', $matches[1], $matches);            
            $device->brand  = $this->multiReplace($regex, 'brand_replacement' , null, $matches);
            $mr_default = ($matches[1] != 'Other' ? $matches[1] : null);
            $device->model  = $this->multiReplace($regex, 'model_replacement' , $mr_default, $matches);
        } 

        return $device;
    }

    /**
     * @param array $regexes
     * @param string $subject
     * @param array $defaults
     * @return array
     */
    private function matchRegexes(array $regexes, $subject, array $defaults = array())
    {
        foreach ($regexes as $regex) {
            $flag = isset($regex->regex_flag) ? $regex->regex_flag : '';
            if (preg_match('@' . $regex->regex . '@' . $flag, $subject, $matches)) {
                return array(
                    $regex,
                    $matches + $defaults
                );
            }
        }

        return array(null, null);
    }

    /**
     * @param stdClass $regex
     * @param string $key
     * @param string $string
     * @return string
     */
    private function replaceString(stdClass $regex, $key, $string)
    {
        if (!isset($regex->{$key})) {
            return $string;
        }

        return str_replace('$1', $string, $regex->{$key});
    }
    
    /**
     * @param stdClass $regex
     * @param string $key
     * @param string $default
     * @param array $matches
     * @return string
     */
    private function multiReplace(stdClass $regex, $key, $default, $matches)
    {
        if (!isset($regex->{$key})) {
            return $default;
        }
        $replacement = preg_replace_callback(
            "|\\$(?<key>\d)|",
            function ($m) use ($matches){
                return isset($matches[$m['key']]) ? $matches[$m['key']] : "";
            },
            $regex->{$key}
        );
        // remove tailing spaces
        $replacement = preg_replace("|\s*$|", "", $replacement);
        $replacement = ($replacement == '' ? null : $replacement);
        return $replacement;
    }

    private static function getDefaultFile()
    {
        return static::$defaultFile ? static::$defaultFile : __DIR__ . '/../../resources/regexes.json';
    }
}
