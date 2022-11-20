const fs = require('fs')
const path = require('path')
const fm = require('front-matter')
const Mustache = require('mustache');
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt('commonmark')

const blogsMdPath = path.join(__dirname, "../../", 'blogs');
const blogsLivePath = path.join(__dirname, "../../", "src", "blog")
const blogTemplatePath = path.join(__dirname, "../../", "src", "partials", "blog.mustache")

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
	fs.readFile(blogTemplatePath, "utf-8", (err, data) => {
		if (err) {
			console.log(err)
		}
		const blogTemplate = data;

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
					const frontMatter = fm(data);
					const contentFromMdToHTML = md.render(frontMatter.body);
					const blogContentVariables = {
						content: contentFromMdToHTML,
						title: frontMatter.attributes.title,
						date: frontMatter.attributes.date,
					}

					console.log("blogTemplate", blogTemplate)

					const blogContent = Mustache.render(blogTemplate, blogContentVariables)

					fs.mkdirSync(path.join(blogsLivePath, frontMatter.attributes.path), { recursive: true })
					fs.writeFile(path.join(blogsLivePath, frontMatter.attributes.path, 'index.html'), blogContent, (err) => {
						if (err) throw err;
						console.log("Saved")
					})
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
