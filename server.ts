const express = require('express'); // Import express
const app = express();             // Initialize app instance
const PORT = 3000;                 // Define port number

app.use(express.json());

app.get('/resources', (req: Request, res: Response) => {
  res.send({
    test: "hello"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

