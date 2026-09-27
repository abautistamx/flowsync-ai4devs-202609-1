import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const input = JSON.parse(fs.readFileSync(0, 'utf8'))

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()

const filePath =
  input.tool_input?.file_path ||
  input.tool_input?.path ||
  ''

if (!filePath) {
  process.exit(0)
}

const absolutePath = path.isAbsolute(filePath)
  ? filePath
  : path.resolve(projectDir, filePath)

const relativePath = path.relative(projectDir, absolutePath)

let workingDir = null

if (relativePath.startsWith('frontend/')) {
  workingDir = path.join(projectDir, 'frontend')
}

if (relativePath.startsWith('backend/')) {
  workingDir = path.join(projectDir, 'backend')
}

if (!workingDir) {
  process.exit(0)
}

// Formatea el fichero editado con Prettier (solo frontend) antes de lintar.
// --ignore-unknown evita fallar con extensiones que Prettier no soporta.
if (relativePath.startsWith('frontend/') && fs.existsSync(absolutePath)) {
  try {
    execSync(`npx prettier --write --ignore-unknown ${JSON.stringify(absolutePath)}`, {
      cwd: workingDir,
      stdio: 'inherit',
    })
  } catch {
    process.exit(2)
  }
}

try {
  execSync('npm run lint', {
    cwd: workingDir,
    stdio: 'inherit',
  })
} catch {
  process.exit(2)
}
