const fse = require('fs-extra')
const archiver = require('archiver')
const fs = require('fs')

const source = 'z:\\早教';
const copy_target = 'd:\\file-server';
const archive_target = 'd:\\archive-server\\example.zip';


fse.emptyDir(copy_target, err => {
	if (err) return console.error(err)
	console.log('empty success!')
	fse.copy(source, copy_target, err => {
		if (err) return console.error(err)
		console.log('copy success!')
		archiver ();
	})
})


function archiver () {
	var output = fs.createWriteStream(archive_target);
	var input = fs.createReadStream(copy_target);
	var archive = archiver('zip', {
		zlib: { level: 9 } // Sets the compression level.
	})
	archive.directory('d:\\file-server\早教', 'd:\\archive-server\\早教');
	// good practice to catch warnings (ie stat failures and other non-blocking errors)
	archive.on('warning', function(err) {
		if (err.code === 'ENOENT') {
			// log warning
		} else {
			// throw error
			throw err;
		}
	});

	// good practice to catch this error explicitly
	archive.on('error', function(err) {
		throw err;
	});
	archive.pipe(output)
	archive.finalize();
}
