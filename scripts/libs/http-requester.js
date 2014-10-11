/// <reference path="jquery-2.1.1.js" />
var httpRequester = (function () {
    function getJSON(url, success, error) {
        $j.ajax({
            url: url,
            type: "GET",
            timeout: 5000,
            contentType: "application/json",
            cache: false,
            success: success,
            error: error
        });
    }
    function postJSON(url, data, success, error) {
        $j.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            timeout: 5000,
            data: JSON.stringify(data),
            success: success,
            error: error
        });
    }
    return {
        getJSON: getJSON,
        postJSON: postJSON
    };
}());