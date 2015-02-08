
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Input variables
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    // Greeting
    $greeting.text('So you want to live at ' + address + '?');

    // Background image
    var googleMapsBaseUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=';
    var googleMapsUrl = googleMapsBaseUrl + address;
    var backgroundImage = "<img class='bgimg' src='" + googleMapsUrl + "''>";
    $body.append(backgroundImage);

    //NY times
    var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch';
    var nyTimesApiKey = '07abd192a7c66b4fe1603702aa976a7f:17:71194010';
    var nyTimesUrl = nyTimesBaseUrl + '.json?api-key=' + nyTimesApiKey + '&q=' + city;

    $.getJSON( nyTimesUrl, function( data ) {
        var docs = data.response.docs;
        $.each( docs, function( key, val ) {
            var title = '<a href="' + val.web_url +'">' + val.headline.main + '</a>';
            
            var leadParagraph = '';
            if (val.lead_paragraph) {
                leadParagraph = '<p>' + val.lead_paragraph + '</p>';
            };

            var listItem = '<li class="article">' + title + leadParagraph + '</li>';

            $nytHeaderElem.text('New York Times Articles about ' + city);
            $nytElem.append(listItem);
        });
    }).fail(function(){
        $nytHeaderElem.text('New York Times Articles could not be loaded');
    });

    // Wikipedia
    var wikiBaseUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=';
    var wikiUrl = wikiBaseUrl + city;

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Could not load wikipedia links');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(data){
            for (var i = 0; i <= data[1].length - 1; i++) {
                var pageLink = '<li><a href="' + data[3][i] + '">' + data[1][i] + '</a></li>';
                $wikiElem.append(pageLink);
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

