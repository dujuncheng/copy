const fs = require('fs-extra')

const source = process.argv[2];
const target = process.argv[3];

fs.emptyDir(target, err => {
	if (err) return console.error(err)
	console.log('empty success!')
	fs.copy(source, target, err => {
		if (err) return console.error(err)
		console.log('copy success!')
	})
})

