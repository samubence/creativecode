var mDatabase;
var mFont;

var mMovies;

var topWhat = "imdb_rating";

function preload() 
{
  mDatabase = loadJSON( "data/imdb-top1000.json" );
  mFont = loadFont( "data/DinBold.ttf" );
}

function setup () 
{
  createCanvas( windowWidth, windowHeight );
  textFont( mFont );
  textSize( 12 );
  colorMode( HSB, 255 );

  // convert the database to an array
  mMovies = mDatabase["movies"];

  // sort the database with a custom function comparing imdb_ratings
  mMovies.sort( function( a, b ) {
    
    let valueA = a[ topWhat ];
    let valueB = b[ topWhat ];
    
    if ( valueA > valueB )
    {
      return -1;
    }
    if ( valueA < valueB )
    {
      return 1;
    }
    return 0;
    });  

  noLoop(); 
}

function draw() 
{
  background(255);

  // how many elemnts we want to dispaly
  let numOfElements = 35;

  // get the min and max values
  let minV = mMovies[ numOfElements - 1 ][ topWhat ];
  let maxV = mMovies[ 0 ][ topWhat ];
  // iterate the database
  for ( let i = 0; i < numOfElements; i++ )
  {
    // calc the position
    let x = 20;
    let y = 20 + i * 20;

    // cals the size
    let valuePct = map( mMovies[ i ][ topWhat ], minV, maxV, 0, 1 );
    let size = map( valuePct, 0, 1, 200, 500 );

    // draw colored rects
    fill( map( valuePct, 1, 0, 0, 60), 255, 255 ); 
    noStroke(); 
    rect( x, y, size, 18 );

    // draw texts on top
    fill(0); 
    text( mMovies[ i ].title_eng, x + 10, y + 15 );
    text( mMovies[ i ][ topWhat ], x + size + 10, y + 15 );
  }
    
}

function windowResized () 
{
  resizeCanvas( windowWidth, windowHeight );
}
