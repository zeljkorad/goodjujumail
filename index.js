const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

app.post('/send-email', (req, res) => {
  const address = req.body.address;
  const email = req.body.email;
  const rentMin = req.body.rentMin;
  const rentAvg = req.body.rentAvg;
  const rentMedian = req.body.rentMedian;
  const rentMax = req.body.rentMax;
  const rent25 = req.body.rent25;
  const rent75 = req.body.rent75;

  const formattedRentMin = formatter.format(rentMin);
  const formattedRentAvg = formatter.format(rentAvg);
  const formattedRentMedian = formatter.format(rentMedian);
  const formattedRentMax = formatter.format(rentMax);
  const formattedRent25 = formatter.format(rent25);
  const formattedRent75 = formatter.format(rent75);

  const transporter = nodemailer.createTransport({
    host: 'c1102597.sgvps.net',
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "noreply@ozrealty.house",
      pass: "@1ce2>#*1^ed",
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'noreply@ozrealty.house',
    to: `${email}`,
    subject: 'Your Free Rental Analysis from Crown Valley',
    html: `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { color: #362655; }
        </style>
      </head>
      <body>
        <h1 class="header">Rental Analysis for <strong>${address}</strong></h1>

        <div class="results">
          <p>Minimum: <strong>${formattedRentMin}</strong></p>
          <p>Average: <strong>${formattedRentAvg}</strong></p>
          <p>Median: <strong>${formattedRentMedian}</strong></p>
          <p>Max: <strong>${formattedRentMax}</strong></p>
          <p>25th Percentile: <strong>${formattedRent25}</strong></p>
          <p>75th Percentile: <strong>${formattedRent75}</strong></p>
        </div>
      </body>
    </html>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});