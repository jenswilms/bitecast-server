const fs = require('fs');
const RSS = require('rss');

export function pushToRSS(s3FileLink: string, rssFeedLink: string) {
    // Code to push the S3 file to the RSS feed goes here
    let feed = fs.readFileSync(rssFeedLink, 'utf8');
    let rss = new RSS(feed);
    let date = new Date();
    let options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateInWords = date.toLocaleDateString("en-US", options);

    rss.item({
        title: 'Podcast Episode',
        description: 'New podcast episode',
        url: s3FileLink, // link to the file
        date: new Date(),
    });

    fs.writeFileSync(rssFeedLink, rss.xml());
}

export function uploadToS3(file: string) {
    // Code to upload the file to S3 goes here
    console.log('Uploading file to S3...');
    console.log('File uploaded to S3.');
}

export function createFeed (name: string) {
    // Code to create a link goes here

    //TODO: fix this
    const websiteURL = "http://localhost:3000"
    const crypto = require('crypto');
    const date = new Date().toISOString();
    const hash = crypto.createHash('md5').update(name + date).digest('hex');
    let feed = new RSS({
        title: 'Your Daily Drive',
        description: 'The Daily Show of the articles you wouldnt read otherwise',
        feed_url: websiteURL + "/" + hash + '/rss.xml',
        site_url: websiteURL,
        // image_url: 'http://yourwebsite.com/icon.png',
        managingEditor: 'Your Name',
        webMaster: 'Your Name',
        language: 'en',
        pubDate: 'May 20, 2020 04:00:00 GMT',
        ttl: '60'
    });

    return feed;
}

export function createItem() {

    const path = require('path');

    // Get absolute path
    const absolutePath = path.resolve('./files/audio/josephgoldstein1.m4a');


    
    const item = {
        title:  'Episode Title',
        description: 'Episode Description',
        url: 'http://example.com/article4?this&that',
        guid: '1123',
        categories: ['Category 1','Category 2','Category 3','Category 4'],
        author: 'Guest Author',
        date: 'May 27, 2012',
        lat: '33.417974',
        long: '112.074673',
        enclosure: {url:'file://' + absolutePath, file: absolutePath},
        custom_elements: [
            {'itunes:author': 'John Doe'},
            {'itunes:subtitle': 'A short primer on table spices'},
            {'itunes:image': {
                _attr: {
                    href: 'http://example.com/pic.png'
                }
            }},
            {'itunes:duration': '7:04'}
        ]
    };

    return item;
}

