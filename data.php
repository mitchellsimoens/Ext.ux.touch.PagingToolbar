<?php

function array2xml($array, $xml = false){
    if($xml === false){
        $xml = new SimpleXMLElement('<data/>');
    }

    $xml->addChild('success', true);
    $xml->addChild('total', 100);

    foreach($array as $key => $value) {
        if(is_array($value)) {
            array2xml($value, $xml->addChild('contact'));
        }else{
            $xml->addChild($key, $value);
        }
    }
    return $xml->asXML();
}

$array = array(
    array(firstName => 'Tommy',   lastName => 'Maintz'),
    array(firstName => 'Rob',     lastName => 'Dougan'),
    array(firstName => 'Ed',      lastName => 'Spencer'),
    array(firstName => 'Jamie',   lastName => 'Avins'),
    array(firstName => 'Aaron',   lastName => 'Conran'),
    array(firstName => 'Dave',    lastName => 'Kaneda'),
    array(firstName => 'Michael', lastName => 'Mullany'),
    array(firstName => 'Abraham', lastName => 'Elias'),
    array(firstName => 'Jay',     lastName => 'Robinson')
);

if ($_REQUEST['type'] === 'json') {
    echo json_encode(array('success' => true, 'total' => 100, 'data' => $array));
} elseif ($_REQUEST['type'] === 'xml') {
    header('Content-type: text/xml');
    $xml = new SimpleXMLElement('<data/>');
    array_walk_recursive($array, array($xml, 'addChild'));
    echo array2xml($array);
}

?>