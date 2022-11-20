const fs = require('fs')
const path = require('path')
const fm = require('front-matter')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

const blogsMdPath = path.join(__dirname, "../../", 'blogs');
const blogsLivePath = path.join(__dirname, "../../", "src", "blog")

// Empty the live blogs folder

const deleteExistingBlogs = async () => {
	fs.readdir(blogsLivePath, (err, files) => {
		if (err) {
			console.log(err)
		}
		if (files) {
			files.forEach(file => {
				console.log(file)
				fs.rmSync(path.join(blogsLivePath, file), { recursive: true }, err => {
					if (err) {
						console.log(err)
					}
				})
			})
		}
	})
	return Promise.resolve()
}

const createBlogPages = async () => {
	fs.readdir(blogsMdPath, (err, files) => {
		console.log("blogs path", files)
		if (err) {
			console.log(err)
		}
		files.forEach(file => {
			fs.readFile(path.join(blogsMdPath, file), "utf-8", (err, data) => {
				if (err) {
					console.log(err)
				}
				console.log("data", data)
				const frontMatter = fm(data);
				const contentFromMdToHTML = md.render(frontMatter.body);

				fs.mkdirSync(path.join(blogsLivePath, frontMatter.attributes.path), { recursive: true })
				fs.writeFile(path.join(blogsLivePath, frontMatter.attributes.path, 'index.html'), contentFromMdToHTML, (err) => {
					if (err) throw err;
					console.log("Saved")
				})
			})
		})
	})
	return Promise.resolve()
}

const doTheMagic = async () => {
	await deleteExistingBlogs()
	await createBlogPages()
}

doTheMagic();
