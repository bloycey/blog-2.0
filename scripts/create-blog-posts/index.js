const fs = require('fs')
const path = require('path')
const fm = require('front-matter')

const blogsPath = path.join(__dirname, "../../", 'blogs');
const dir = fs.opendirSync(blogsPath);

fs.readdir(blogsPath, (err, files) => {
	if (err) {
		console.log(err)
	}
	files.forEach(file => {
		fs.readFile(path.join(blogsPath, file), "utf-8", (err, data) => {
			if (err) {
				console.log(err)
			}
			const frontMatter = fm(data);
			fs.mkdirSync(`src/blog/${frontMatter.attributes.path}`)
			fs.writeFile(`src/blog/${frontMatter.attributes.path}/index.html`, JSON.stringify(frontMatter), (err) => {
				if (err) throw err;
				console.log("Saved")
			})
		})
	})
})

// Need to delete everything from src except the index.html


// const currentDate = new Date();

// fs.writeFile('example.txt', currentDate.toString(), (err) => {
// 	if (err) throw err;
// 	console.log("Saved")
// })