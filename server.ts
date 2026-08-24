const express = require('express'); // Import express
const app = express();             // Initialize app instance
const PORT = 3000;                 // Define port number

app.use(express.json());

app.get('/resources', (req: Request, res: Response) => {
  res.send([{
    id: '1',
    title: 'Title2',
    description: 'Description',
    short_description: 'Short Description',
    image: 'iamge',
    worth: 'worth',
    link: 'Link',
  }, {
    id: '2',
    title: 'Title4',
    description: 'Description',
    short_description: 'Short Description',
    image: 'iamge',
    worth: 'worth',
    link: 'Link',
  }]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

