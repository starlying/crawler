var Crawler = require("simplecrawler");
var mkdirp = require('mkdirp');
var fs = require('fs');

var domain = "theme-next.iissnan.com"

var crawler = new Crawler(domain);

function write(filePath, responseBuffer, relatedUrl) {
  fs.writeFile(filePath, responseBuffer, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("download %s", relatedUrl);
  });
}

crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    // console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    // console.log("It was a resource of type %s", response.headers['content-type']);
    // console.log("It was a resource of content %s", responseBuffer);
    // var filePath = __dirname + '/' + domain + '/' + queueItem.url.replace('http://theme-next.iissnan.com/', '');
    // if (queueItem.url.indexOf('.') === -1) {
    //   filePath += '/index.html'
    // }
    var relatedUrl = queueItem.url.replace('http://theme-next.iissnan.com/', '')
    if (!relatedUrl || relatedUrl.indexOf('.') === -1) {
      relatedUrl += 'index.html'
    }
    if (relatedUrl.lastIndexOf('?') !== -1) {
      relatedUrl = relatedUrl.substr(0, relatedUrl.lastIndexOf('?'))
    }

    var filePath = __dirname + '/' + domain + '/' + relatedUrl;
    var dirPath = filePath.substr(0, filePath.lastIndexOf('/'))

    if (!fs.existsSync(dirPath)) {
      mkdirp(dirPath, function(err) {
        if(err) {
          return console.log(err);
        }
        write(filePath, responseBuffer, relatedUrl);
      });
    } else {
      write(filePath, responseBuffer, relatedUrl)
    }
});

crawler.start();
