var mDatabase;
var mFont;

var mMovies;

// how many elemnts we want to dispaly
var numOfElements = 60;

// physics parameters
var gravityForce = 0.01;
var collisionForce = 0.5;

var minV, maxV;
var selectedMovie = -1;

function preload() 
{
  mDatabase = loadJSON( "data/imdb-top1000.json" );
  mFont = loadFont( "data/DinBold.ttf" );
}

function setup () 
{
  createCanvas( windowWidth, windowHeight );
  textFont( mFont );
  textSize( 8 );
  colorMode( HSB, 255 );

  // convert the database to an array
  mMovies = mDatabase["movies"];

  // sort the database with a custom function comparing imdb_ratings
  mMovies.sort( function( a, b ) {
    
    let valueA = a.imdb_rating;
    let valueB = b.imdb_rating;
    
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

  // get the min and max values
  minV = mMovies[ numOfElements - 1 ].imdb_rating;
  maxV = mMovies[ 0 ].imdb_rating;
  
  // add extra variables for each element
  // for storing position and radius
  for ( let i = 0; i < numOfElements; i++ )
  {
    mMovies[i].x = random( width );
    mMovies[i].y = random( height );
    mMovies[i].r = map( mMovies[i].imdb_rating, minV, maxV, 10, 50 );
    mMovies[i].origR = mMovies[i].r;  // this is for selection animation
  }    
}

function draw() 
{  
  background(255);

  // iterate all elements using "a" from 0 to numOfElements
  for ( let a = 0; a < numOfElements; a++ )
  {
    // move the circles to the center
    mMovies[ a ].x += ( width / 2 - mMovies[ a ].x ) * gravityForce;
    mMovies[ a ].y += ( height / 2 - mMovies[ a ].y ) * gravityForce;

    // make selection animation
    if ( selectedMovie == a )
    {
      // when selected grow radius
      mMovies[ a ].r += ( mMovies[ a ].origR + 50 - mMovies[ a ].r ) * 0.1;
    }
    else
    {
      // when not shrink back to original radius
      mMovies[ a ].r += ( mMovies[ a ].origR - mMovies[ a ].r ) * 0.1;
    }

    // check for all other circles for intersection
    for ( let b = 0; b < numOfElements; b++ )
    {
      if ( a != b ) // check for self collision
      {
        // get the direction vector
        let vx = mMovies[ a ].x - mMovies[ b ].x;
        let vy = mMovies[ a ].y - mMovies[ b ].y;
        
        // get the length of the vector
        let d = Math.sqrt( vx * vx + vy * vy );

        // get the desired distance based on circles radius
        let targetDistance = mMovies[ a ].r + mMovies[ b ].r + 5; // add 5 for extra spacing
        
        // when they collide
        if ( d < targetDistance )
        {
          // normalize the vector
          vx /= d;
          vy /= d;
          
          let force = (targetDistance - d) * collisionForce;
          // move the circles apart
          mMovies[ a ].x += vx * force;
          mMovies[ a ].y += vy * force;
          mMovies[ b ].x -= vx * force;
          mMovies[ b ].y -= vy * force;
        }
      }
    }

    ///////////////////////////////////////////////////////////////////
    // now lets display
    
    // when selected make it dark
    if ( selectedMovie == a )
    {
      fill( 50 );
    }
    else
    {
      fill( 200 );
    }
    // draw the circle
    stroke(0); ellipse( mMovies[ a ].x, mMovies[ a ].y, mMovies[ a ].r * 2, mMovies[ a ].r * 2 );

    // when selected draw the title
    if ( selectedMovie == a )
    {
      let title = mMovies[ a ].title_eng;
      let points = mMovies[ a ].imdb_rating.toPrecision(2);
      // get the text width for centering text
      let titleWidth = textWidth( title );

      noStroke(); fill(255); 
      text( title, mMovies[ a ].x - titleWidth / 2, mMovies[ a ].y );
      text( points, mMovies[ a ].x - 4, mMovies[ a ].y + 15 );
    }
  } 
}

// make the picking
function mousePressed()
{
  for ( let i = 0; i < numOfElements; i++ )
  {
    let d = dist( mMovies[ i ].x, mMovies[ i ].y, mouseX, mouseY );
    if ( d < mMovies[ i ].r )
    {
      selectedMovie = i;
      return;
    }
  }
  // when no picking happened, make selection -1 to indicate
  selectedMovie = -1;
}

function windowResized () 
{
  resizeCanvas( windowWidth, windowHeight );
}
