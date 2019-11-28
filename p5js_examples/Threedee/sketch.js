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
  textSize( 5 );
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

  let space = 300;
  for ( let i = 0; i < mMovies.length; i++ )
  {
    let x = map( mMovies[i]["year"], year[0], year[1], -space, space );
    let y = map ( mMovies[i]["votes"], votes[0], votes[1], -space, space );
    let z = map( mMovies[i]["imdb_rating"], imdb_rating[0], imdb_rating[1], -space, space );
    push();
    translate( x, y, z );
    noStroke(); fill( 0 ); box( 5 );

/*
    // draw title when camera is close
    let dx = x - easycam.camEYE[0];
    let dy = y - easycam.camEYE[1];
    let dz = z - easycam.camEYE[2];
    let dst = Math.sqrt( dx * dx + dy * dy + dz * dz);
    
    if ( dst < 200 )
    {
      //scale( 0.5 );
      text( mMovies[i].title_hu, -textWidth( mMovies[i].title_hu ) / 2, 10 );
    }
*/
    pop();    
    
  }

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

function windowResized () 
{
  resizeCanvas( windowWidth, windowHeight );
}
