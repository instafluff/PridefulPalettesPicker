const ComfyDB = require( "comfydb" );
var ComfyWeb = require( "webwebweb" );
var brain = require( "brain.js" );
const net = new brain.NeuralNetwork();

async function setupPaletteServer() {
  try {
    await ComfyDB.Init();
    await ComfyDB.Collections.Create( "palettes" );
    await ComfyDB.Collections.Create( "colorcombos" );
    ComfyWeb.APIs[ "/save" ] = async ( qs ) => {
      console.log( qs );
      var colors = qs.palette.split( "," );
      console.log( colors );
      await ComfyDB.Data.SetByKey( "palettes", new Date().toISOString(), { palette: colors } );
      var palettes = await ComfyDB.Data.FindLatest( "palettes" );
      console.log( palettes );
      return { "status": 1 };
    };
    ComfyWeb.APIs[ "/colors" ] = async ( qs ) => {
      console.log( "colors!" );
      var palettes = await ComfyDB.Data.FindLatest( "palettes" );
      console.log( palettes );
      return palettes;
    };
    ComfyWeb.APIs[ "/savecombos" ] = async ( qs ) => {
      console.log( qs );
      var colors = qs.combo.split( "," );
      console.log( colors );
      await ComfyDB.Data.SetByKey( "colorcombos", new Date().toISOString(), { combo: colors } );
      var combo = await ComfyDB.Data.FindLatest( "colorcombos" );
      console.log( combo );
      var trainingData = combo.map( x => ({ input: x }, { output: { [qs.result]: 1 }}) );
      net.train( trainingData );
      return { "status": 1 };
    };
    ComfyWeb.APIs[ "/combos" ] = async ( qs ) => {
      var combo = await ComfyDB.Data.FindLatest( "colorcombos" );
      console.log( combo );
      var trainingData = combo.map( x => ({ input: x }, { output: { [qs.result]: 1 }}) );
      net.train( trainingData );
      return combo;
    };
    ComfyWeb.APIs[ "/predictcombo" ] = async ( qs ) => {
      console.log( qs );
      var colors = qs.combo.split( "," );
      console.log( colors );
      var combo = await ComfyDB.Data.FindLatest( "colorcombos" );
      console.log( combo );
      var result = net.run( qs.combo );
      return result;
    };
    ComfyWeb.Run( 8085 );
  }
  catch( ex ) {
    console.log( "ERROR:", ex );
  }
}

setupPaletteServer();

// server.on('request', async (req, res) => {
//   // req.path is the URL resource (file name) from server.rootPath
//   // req.elapsedTime returns a string of the request's elapsed time
//   if( req.path === "/save" ) {
//     try {
//       // var qs = querystring.decode( req.url.split( "?" )[ 1 ] );
//       // console.log( qs );
//       // var colors = qs.palette.split( "," );
//       // console.log( colors );
//       // await ComfyDB.Data.SetByKey( "palettes", new Date().toISOString(), { palette: colors } );
//       // var palettes = await ComfyDB.Data.FindLatest( "palettes" );
//       // console.log( palettes );
//       // res.write( "test" );
//       // res.end();
//     }
//     catch( err ) {
//       req.write( err.message );
//       req.end();
//     }
//   }
//   else if( req.path === "/colors" ) {
//     console.log( "colors!" );
//     var palettes = await ComfyDB.Data.FindLatest( "palettes" );
//     res.write( palettes );
//     res.end();
//   }
// });
