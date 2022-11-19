const fs = require('fs')
const path = require('path')
const fm = require('front-matter')

const blogsMdPath = path.join(__dirname, "../../", 'blogs');
const blogsLivePath = path.join(__dirname, "../../", "src/", "blog")

console.log(blogsMdPath)
console.log(blogsLivePath)

// Empty the live blogs folder
fs.readdir(blogsLivePath, (err, files) => {
	if (err) {
		console.log(err)
	}
	console.log(files)
	files.forEach(file => {
		console.log(file)
		fs.rmSync(path.join(blogsLivePath, file), { recursive: true }, err => {
			if (err) {
				console.log(err)
			}
		})
	})
})

fs.readdir(blogsMdPath, (err, files) => {
	if (err) {
		console.log(err)
	}
	files.forEach(file => {
		fs.readFile(path.join(blogsMdPath, file), "utf-8", (err, data) => {
			if (err) {
				console.log(err)
			}
			const frontMatter = fm(data);
			if (!fs.existsSync(`src/blog/${frontMatter.attributes.path}`)) {
				fs.mkdirSync(`src/blog/${frontMatter.attributes.path}`)
				fs.writeFile(`src/blog/${frontMatter.attributes.path}/index.html`, JSON.stringify(frontMatter), (err) => {
					if (err) throw err;
					console.log("Saved")
				})
			}
		})
	})
})

// Need to delete everything from src except the index.html


// const currentDate = new Date();

// fs.writeFile('example.txt', currentDate.toString(), (err) => {
// 	if (err) throw err;
// 	console.log("Saved")
// })