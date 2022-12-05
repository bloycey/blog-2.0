const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Mustache = require('mustache');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt('commonmark');

const blogsMdPath = path.join(__dirname, "../../", 'write-a-blog');
const blogsLivePath = path.join(__dirname, "../../", "blog")
const blogTemplatePath = path.join(__dirname, "../../", "partials", "blog.mustache")
const homeTemplatePath = path.join(__dirname, "../../", "partials", "home-template.html")
const homeLinkTemplatePath = path.join(__dirname, "../../", "partials", "home_link.mustache")
const homeLivePath = path.join(__dirname, "../../")

const deleteExistingBlogs = async () => {
	fs.readdir(blogsLivePath, (err, files) => {
		if (files) {
			files.forEach(file => {
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
		const blogTemplate = data;
		fs.readdir(blogsMdPath, (err, files) => {
			files.forEach(file => {
				fs.readFile(path.join(blogsMdPath, file), "utf-8", (err, data) => {
					const frontMatter = fm(data);
					const contentFromMdToHTML = md.render(frontMatter.body);
					const { title, description, date } = frontMatter.attributes;
					const blogContentVariables = {
						title,
						description,
						date: new Date(date).toDateString(),
						content: contentFromMdToHTML
					}

					const blogContent = Mustache.render(blogTemplate, blogContentVariables)

					// Inject the fancy links
					const parsedBlog = new JSDOM(blogContent).window.document;
					const svg = new JSDOM('<svg viewBox="0 0 70 36"><path d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527" /></svg>').window.document.querySelector('svg')
					const allLinks = Array.from(parsedBlog.querySelectorAll('.blog a'))
					allLinks.forEach(link => {
						link.appendChild(svg)
					})

					const finalBlogContentAsString = parsedBlog.documentElement.outerHTML;
					fs.mkdirSync(path.join(blogsLivePath, frontMatter.attributes.path), { recursive: true })
					fs.writeFile(path.join(blogsLivePath, frontMatter.attributes.path, 'index.html'), finalBlogContentAsString, (err) => {
						console.log("Saved")
					})
				})
			})
		})
	})
	return Promise.resolve()
}

const createHomePageLinks = async () => {
	let allLinks = ""
	fs.readdir(blogsMdPath, (err, files) => {
		files.forEach(file => {
			const data = fs.readFileSync(path.join(blogsMdPath, file), "utf-8")
			const frontMatter = fm(data);
			const contentFromMdToHTML = md.render(frontMatter.body);
			const { title, description, date } = frontMatter.attributes;
			const blogContentVariables = {
				title,
				description,
				date: new Date(date).toDateString(),
				path: frontMatter.attributes.path
			}
			const homeLinkTemplate = fs.readFileSync(homeLinkTemplatePath, "utf-8")
			const homeLink = Mustache.render(homeLinkTemplate, blogContentVariables)
			allLinks = `${homeLink} ${allLinks}`
		})
		fs.readFile(homeTemplatePath, "utf-8", (err, data) => {
			const homeTemplate = data;
			const newHomeTemplate = homeTemplate.replace("{{links}}", allLinks);
			fs.writeFile(path.join(homeLivePath, 'index.html'), newHomeTemplate, (err) => { console.log(err) })
		})
	})
}

const doTheMagic = async () => {
	await deleteExistingBlogs().catch(err => { console.log(err) })
	await createBlogPages().catch(err => { console.log(err) })
	await createHomePageLinks().catch(err => { console.log(err) })
}

doTheMagic();
