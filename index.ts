 const express = require('express');
 const axios = require('axios');
 const app = express();
 const port = 3000;
 const RSS = require('rss');
 require('dotenv').config();

 //TODO: create a link for each RSS feed from DB

 app.get('/readwise', async (req: any, res: any) => {

   try {
     const response = await axios.get('https://readwise.io/api/v2/books/', {
       headers: {
         'Authorization': `Token ${process.env.READWISE_API}`
       }
     });

     const links = response.data.results.map((book: any) => {
        return {
          title: book.title,
          link: book.amazon_url
        };
      });
    // const links = ['https://sfstandard.com/2023/01/13/what-is-cerebral-valley-san-franciscos-nerdiest-new-neighborhood/']


    let summaries: string[] = [];
    for (const link of links) {
      // check if it's youtube

      let article;
      

      //extract article
      if (link.includes('youtube')) {
        // parse through TwelveLabs
      } else {
        const { parseArticle } = require('./lib/parsing');
        article = await parseArticle(link);

      }

      //get summary
      const { getSummary } = require('./lib/summarizing');
      const summary = await getSummary(article);
      summaries.push(summary);
    }


    //create final podcast
    const { createFinalPodcast } = require('./lib/summarizing');
    const finalPodcast = await createFinalPodcast(summaries);

    //send to eleven labs
    // const { createPodcast } = require('./lib/elevenlabs');
    res.send(response.data);

    //send to S3 bucket
    const { uploadToS3 } = require('./lib/hosting');
    const uploadLink = uploadToS3(finalPodcast);

    //get users RSS feed
    const { getRSSFeed } = require('./lib/hosting');
    const rssFeedLink = getRSSFeed();


    //send to RSS feed
    const { pushToRSS } = require('./lib/hosting');
    pushToRSS(uploadLink, rssFeedLink);


   } catch (error) {
    //  console.error(error);
     res.status(500).send('Error retrieving data from Readwise.');
   }
 });

//  app.get('/pocket', async (req: any, res: any) => {
//   try {
//     const response = await axios.post('https://getpocket.com/v3/get', {
//       consumer_key: process.env.POCKET_CONSUMER_KEY,
//       // access_token: process.env.POCKET_ACCESS_TOKEN,
//       sort: 'newest',
//       detailType: 'simple'
//     }, {
//       headers: {
//         'Content-Type': 'application/json; charset=UTF8',
//         'X-Accept': 'application/json'
//       }
//     });
//     res.send(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving data from Pocket.');
//   }
// });


app.get('/rss', (req: any, res: any) => {

  const {createFeed, getFeed, createItem} = require('./lib/hosting');
  const feed = createFeed("Jens");

  const item = createItem();
  feed.item(item);

  // Generate the XML and return it as a response
  let xml = feed.xml();
  res.type('application/rss+xml');
  res.send(xml);


});



 app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
 });


 