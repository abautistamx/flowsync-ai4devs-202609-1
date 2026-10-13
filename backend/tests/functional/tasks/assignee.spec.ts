import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito homónimo de `openspec/specs/tasks/spec.md`: el responsable con
 * nombre, que no se filtren datos de cuenta (ni suelta ni en la lista) y el
 * responsable sin nombre.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const hoy = '2026-10-12'

  async function sesion(client: any, fullName: string | null, email = 'ada@example.com') {
    await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  async function crearTarea(client: any, token: string, title = 'Revisar el informe') {
    const response = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title })

    return response.body().data.id as number
  }

  test('el responsable incluye su nombre e iniciales', async ({ client, assert }) => {
    const token = await sesion(client, 'Ada Lovelace')
    const id = await crearTarea(client, token)

    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const assignee = response.body().data.assignee
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('el responsable no expone el email ni las fechas de su cuenta', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, 'Ada Lovelace')
    const id = await crearTarea(client, token)

    const suelta = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const enLista = lista.body().data.find((tarea: any) => tarea.id === id)
    assert.exists(enLista)

    for (const assignee of [suelta.body().data.assignee, enLista.assignee]) {
      assert.notProperty(assignee, 'email')
      assert.notProperty(assignee, 'password')
      assert.notProperty(assignee, 'createdAt')
      assert.notProperty(assignee, 'updatedAt')
    }
  })

  test('un responsable sin nombre conserva sus iniciales y no expone el email', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, null)
    const id = await crearTarea(client, token)

    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const assignee = response.body().data.assignee
    assert.isNull(assignee.fullName)
    assert.isString(assignee.initials)
    assert.isNotEmpty(assignee.initials)
    assert.notProperty(assignee, 'email')
  })
})
