var mDatabase;
var mFont;

var mMovies;

var easycam;

function preload() 
{
  mDatabase = loadJSON( "data/imdb-top1000.json" );
  mFont = loadFont( "data/DinBold.ttf" );
}

function setup () 
{
  let c = createCanvas( windowWidth, windowHeight, WEBGL );
  textFont( mFont );
  textSize( 12 );
  colorMode( HSB, 255 );

  // convert the database to an array
  mMovies = mDatabase["movies"];

  // fix some easycam related compatibility issue
  Dw.EasyCam.prototype.apply = function(n) {
    var o = this.cam;
    n = n || o.renderer,
      n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };
  easycam = createEasyCam();
}

function draw() 
{
  background(255);
  let year = getDataMinMax( "year" );
  let votes = getDataMinMax( "votes" );
  let imdb_rating = getDataMinMax( "imdb_rating" );

  for ( let i = 0; i < mMovies.length; i++ )
  {
    let x = map( mMovies[i]["year"], year[0], year[1], -100, 100 );
    let y = map ( mMovies[i]["votes"], votes[0], votes[1], -100, 100 );
    let z = map( mMovies[i]["imdb_rating"], imdb_rating[0], imdb_rating[1], -100, 100 );
    push();
    translate( x, y, z );
    noStroke(); fill( 0 ); box( 2 );
    pop();
  }

}

function windowResized () 
{
  resizeCanvas( windowWidth, windowHeight );
}

function getDataMinMax( data )
{
  let minmax = [0, 0];  
  for ( let i = 0; i < mMovies.length; i++ )
  {
    if ( i == 0 )
    {
      minmax[0] = mMovies[i][ data ];
      minmax[1] = mMovies[i][ data ];
    }
    else
    {
      minmax[0] = Math.min( minmax[0], mMovies[i][ data ] );
      minmax[1] = Math.max( minmax[1], mMovies[i][ data ] );
    }    
  }
  return minmax;
}