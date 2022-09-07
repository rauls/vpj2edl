#!node vpj2edl.js -s ../OpenYourMind-video/OpenYourMind.vpj -edl
# ***
# *** Created by Raul Sobon
# *** VideoPad to EDL conversion software
# *** Command Options : 
# *** -s : define source of .vpj file to convert
# *** -edl : output EDL format files
# *** -fps : define the FPS counter
#

var fs = require ('fs');
var util;
var FPS = 30;

function ZINT(sz,n) {
	var str = parseInt(n).toString();
	sz -= str.length;
	while( sz>0 ) {
		str = '0'+str; sz--;
	}
	return str;
}

function ms2frame(ms) {
	return parseInt( FPS*ms/1000 );
}


function TCFSTR(frame,sep=':') {
	var str = '';
	var tv = frame/FPS;
	ts = [ (tv/3600)%60, (tv/60)%60, tv%60 ]
	ts.map( function(v,i) {
		v = parseInt(v);
		if( v < 10 ) {
			str += '0';
		}
		str+=v;
		if( i<2 ) {
			str+=sep
		}
	})
	var frame = ZINT( 2, frame%FPS );
	return str+':'+frame;
}

function TCSTR(timems) {
	var tc = FPS*timems/1000;
	return TCFSTR(tc);
}

var options = {};

function process_file( ERR, filedata ) {
	let data = {};
	if ( !ERR ) {
		let lines = filedata.split(/\n/);
		let last_section = '';
		//console.warn('Total lines# '+ lines.length, filedata.substring(0,20) );
		for( var n in lines ) {
			let line = lines[n];

			let parts = line.split('&');
			parts = parts.map( (f) => {
				return f.split('=');
			})
			let section = parts[0][0];

			if ( parts.length <= 2 ) {
				data[ section ] = parts[0][1];
				last_section = section;
			} else {
				let h1 = parts[0][1];
				let item = {};
				parts.forEach( (p) => {
					let f = p[0];
					let v = p[1];
					if( parseInt(v) == v ) {
						item[ f ] = parseInt(v);
					} else {
						item[ f ] = decodeURIComponent(v);
					}
				})
				let field = last_section + '_list';
				if( ! data[field] ) {
					data[field] = {};
				}
				if( section == 'h' ) {
					data[field][h1] = ( item );

					if( last_section == 'tracks' ) {
						data[field][h1].data = [];
						//console.log("Store data.field.data = [] ", data[field][h1].data )
					} else
					if( last_section == 'trackclips' ) {
						if( typeof(item.in) == 'number' && item.out ) 
						{
							item.EDL_IN = TCSTR( item.in );
							item.DUR = parseInt(item.out) - parseInt(item.in);
							item.EDL_OUT = TCSTR( item.out );
						} else
						if( item.duration ) 
						{
							item.DUR = parseInt(item.duration);
							item.EDL_IN = TCSTR( 0 );
							item.EDL_OUT = TCSTR( item.duration );
						}
						item.TC_IN  = TCSTR( item.offset );
						item.TC_OUT = TCSTR( item.offset + item.DUR );
						let htrack = item.htrack;
						data.tracks_list[htrack].data.push( item ); 
					}
				} else {
					let list = data[field].list || (data[field].list = []);
					list.push( item );
				}
			}

		}

		console.log( data );

		if (options.edl) {
			data.tracks = parseInt(data.tracks);
			for( var t=0; t<(data.tracks);t++) {
				if( options.verbose ) {
					console.log("Creating EDL File..."+(t+1));
				}
				create_edl_file( data, t );
			}
		}
	}	
}

function showerr(err) {
	if( err) {
		console.warn(err);
	}
}
//h=11, type=2, name=Audio%20Track%201, output=1, solo=0, volume=100, pan=0, collapsed0=0, collapsed1=0, collapsed2=1, collapsed3=0, collapsed4=0, collapsed5=0, collapsed6=0, collapsed7=0, locked=1, hsequence=9
function create_edl_file( data, trackno ) {
	var tracks = Object.keys( data.tracks_list );
	var trackh = tracks[ trackno ];
	var track = data.tracks_list[ trackh ];
	var name = track.name;
	var types = { 2: 'A', 3: 'V' };
	var type = track.type == 2 ? 'A' : 'V';
	fs.open( `EDL_${name}.edl`, 'w+', (err,fd) => {
		fs.writeSync( fd, `TITLE Clips - TRACK ${trackno+1}\n` );
		fs.writeSync( fd, `FCM: NON-DROP FRAME\n` );
		track.data.forEach( (clip,i) => {
			let fpath = clip.path;
			let pos = ZINT(3,i+1);
			let tape = (type=='A') ? 'AX' : 'BL';
			let timecode = `${clip.EDL_IN} ${clip.EDL_OUT} ${clip.TC_IN} ${clip.TC_OUT}`;
			fs.writeSync( fd, `${pos}  ${tape}       ${type}     C        ${timecode}\n` );
			if( clip.hadlinkedaudio==1) {
				type = 'A';
				tape = 'AX';
				fs.writeSync( fd, `${pos}  ${tape}       ${type}     C        ${timecode}\n` );
			}
			fs.writeSync( fd, `* FROM CLIP NAME: ${clip.name}\n` );
		});
	});
}

function main() {
	let source = '';

	let max = process.argv.length;
	let n = 1;
	while( n < max ) {
		let cmd = process.argv[n];
		if( cmd ) {
			let param = (n<max) ? process.argv[n+1] : '';
			if( cmd.charAt(0) == '-' ) {
				if( cmd.match(/\-s/) ) {
					source = param;
				}
				if( cmd.match(/\-edl/) ) {
					options.edl = true;
				}
				if( cmd.match(/\-fps/) ) {
					options.FPS = parseInt(param);
				}
			}
		}
		n++;
	}
	if ( source ) {
		let data = fs.readFile( source, 'UTF8', process_file );
	}	
}

// RUNAS : node vpj2edl.js -s OpenYourMind.vpj -edl
return main();
