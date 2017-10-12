const fse = require('fs-extra')
const archiver = require('archiver')
const fs = require('fs')
const walk = require('walk')
var rimraf = require('rimraf');


//设定源路径和复制后的目标路径
const source = '/Users/dudu/Desktop/test_archive';
const copy_target = '/Users/dudu/Desktop/test_archive_copy';

//设定要打包的路径名称
const filter = ['设计稿']



fse.emptyDir(copy_target, err => {
	if (err) return console.error(err)
	console.log('empty success!')
	fse.copy(source, copy_target, err => {
		if (err) return console.error(err)
		console.log('copy success!')
		start_walk()
	})
})

function start_walk () {
	var walker = walk.walk(copy_target);
	
	walker.on("directory", function (root, fileStats, next) {
		filter.forEach(function(str){
			if(fileStats.name === str) {
				start_archive(root, fileStats, next)
			}
		})
		
		next();
	});
	
	walker.on("errors", function (root, nodeStatsArray, next) {
		next();
	});
	
	walker.on("end", function () {
		console.log("all done");
	});
}

function start_archive (root,fileStats,next) {
	const output = fs.createWriteStream( root + '/' + fileStats.name + '.zip');
	const archive = archiver('zip', {
		zlib: { level: 9 }
	});
	archive.directory(root + '/' + fileStats.name, fileStats.name)
	output.on('close', function() {
		rimraf(root + '/' + fileStats.name, function () {
			console.log('压缩和删除完成');
		});
	});
	archive.on('warning', function(err) {
		if (err.code === 'ENOENT') {
			// log warning
		} else {
			// throw error
			throw err;
		}
	});
	archive.on('error', function(err) {
		throw err;
	});
	archive.pipe(output);
	archive.finalize();
}