#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const files = process.argv.slice(2)
if (files.length === 0) {
  throw new Error('No files given')
}

Promise.all(files.map(async filePath => {
  const fullPath = path.join(process.cwd(), filePath)
  const content = await fs.promises.readFile(fullPath, {encoding: 'utf-8'})

  const newContent = content.split('\n').reduce((result, line) => {
    const [isMatch, exampleLink] = line.match(/\[view code\]\((.*)\)/) || []

    if (isMatch) {
      const examplePath = exampleLink.replace(/#.*$/, '')
      const exampleContent = fs.readFileSync(examplePath, {encoding: 'utf-8'}).split('\n')

      const clipLines = line.match(/#L(\d*)(-L(\d*))?/)
      const clipStart = Number(clipLines ? clipLines[1] : 0)
      const clipEnd = clipLines && clipLines[3] ? Number(clipLines[3]) : 0

      const fileExt = path.parse(examplePath).ext
      const lang = fileExt.slice(1)
      result.push('```' + lang)

      if (clipEnd) {
        result.push(...exampleContent.slice(clipStart, clipEnd))
      } else {
        result.push(...exampleContent.slice(clipStart))
      }

      if (result[result.length - 1] === '') {
        result.splice(-1)
      }

      result.push('```')
    } else {
      result.push(line)
    }
    return result
  }, [])

  fs.writeFileSync(fullPath, newContent.join('\n'))
})).catch(e => {
  console.error(e)
  process.exit(1)
})
