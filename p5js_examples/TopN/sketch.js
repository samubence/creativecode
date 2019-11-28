var mDatabase;
var mFont;

var mMovies;

// this is an property from the json database what we will sort and display
// there are only a few meaningful numerical params in this database that we can choose from
// "gross_usd"
// "year"
// ?? "votes"
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
    
    // normalliy we use valueA "<"" valueB comparsion here to sort from small to large, 
    // but in our case we need the other way around
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

  // no animation, render only one frame
  noLoop(); 
}

function draw() 
{
  background(255);

  // how many elemnts we want to dispaly
  let numOfElements = 20;

  // get the min and max values
  let minV = mMovies[ numOfElements - 1 ][ topWhat ];
  let maxV = mMovies[ 0 ][ topWhat ];
  // iterate the database
  for ( let i = 0; i < numOfElements; i++ )
  {
    // calc the position
    let x = 20;
    let y = 20 + i * 35;

    // cals the size
    let valuePct = map( mMovies[ i ][ topWhat ], minV, maxV, 0, 1 );
    let size = map( valuePct, 0, 1, 200, 500 );

    fill( 0 );
    noStroke(); 
    rect( x, y, size, 2 );

    // draw texts on top
    fill(0); 
    text( mMovies[ i ].title_eng, x + 10, y + 15 );
    text( mMovies[ i ][ topWhat ], x + size + 10, y + 5 );
  }
    
}

function windowResized () 
{
  resizeCanvas( windowWidth, windowHeight );
}
