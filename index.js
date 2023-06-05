const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));


app.get('/', function(req, res) {

    res.sendFile(__dirname + '/login.html');
  });


app.post('/', function(req, res) {
  const nom = req.body.nom;
  const motDePasse = req.body.motDePasse;

  if (!nom || !motDePasse) {
    res.status(400).send('Nom d\'utilisateur et mot de passe requis');
    return;
  }

  const utilisateurs = require('./users.json');
  const utilisateur = utilisateurs[nom];

  if (!utilisateur ) {
    res.status(401).send('Nom d\'utilisateur incorrect');
    } else if ( utilisateur.motDePasse !== motDePasse) {
      res.status(401).send('Mot de passe incorrect');
    return;
  }

  res.sendFile(__dirname + '/dashboard.html');
});

//app.get('/:nomPage', (req, res) => {
 //  const nomPage = req.params.nomPage;
  
   //Utilisation de la méthode res.sendFile() pour envoyer le fichier HTML correspondant à la page demandée
   //res.sendFile(`${nomPage}`, { root: __dirname + '/' }, (err) => {
   //   if (err) {
     //   console.error(err);
     //   res.status(404).send('Page not found');
    //  }
  // });
// });

const path = require('path');

app.get('/:path(*)', async (req, res) => {
  const input = req.params.path;
  const isUrl = /^https?:\/\//i.test(input);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (isUrl) {
      await page.goto(input);
    } else {
      const localFilePath = path.join(__dirname, input);
      res.sendFile(`${nomPage}`, { root: __dirname + '/' });
    }

    const html = await page.content();

    await browser.close();

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});



app.listen(9000, function() {
  console.log('Serveur démarré sur le port 9000');
});
