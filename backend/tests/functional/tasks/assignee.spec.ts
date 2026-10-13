import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito homónimo de `openspec/specs/tasks/spec.md`: el responsable con
 * nombre, que no se filtren datos de cuenta y el responsable sin nombre.
 *
 * Cada scenario se comprueba sobre las tres respuestas que devuelven una tarea
 * (la creación, la tarea suelta y la lista) y se afirma sobre las tres a la vez,
 * para que un fallo en una no esconda lo que pasa en las otras.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const hoy = '2026-10-12'

  async function sesion(client: any, fullName: string | null, email = 'ada@example.com') {
    await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  /**
   * Crea una tarea y devuelve su `assignee` tal como llega en cada una de las
   * tres respuestas que la incluyen.
   */
  async function responsables(client: any, token: string) {
    const creacion = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })
    creacion.assertStatus(201)

    const id = creacion.body().data.id

    const suelta = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)
    suelta.assertStatus(200)

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    lista.assertStatus(200)

    const enLista = lista.body().data.find((tarea: any) => tarea.id === id)

    return {
      creacion: creacion.body().data.assignee,
      suelta: suelta.body().data.assignee,
      lista: enLista?.assignee,
    }
  }

  function porRespuesta<T>(assignees: Record<string, any>, leer: (assignee: any) => T) {
    return Object.fromEntries(
      Object.entries(assignees).map(([respuesta, assignee]) => [respuesta, leer(assignee)])
    )
  }

  test('el responsable incluye su nombre e iniciales', async ({ client, assert }) => {
    const token = await sesion(client, 'Ada Lovelace')
    const assignees = await responsables(client, token)

    const esperado = { fullName: 'Ada Lovelace', initials: 'AL' }

    assert.deepEqual(
      porRespuesta(assignees, (a) => ({ fullName: a?.fullName, initials: a?.initials })),
      { creacion: esperado, suelta: esperado, lista: esperado }
    )
  })

  test('el responsable solo trae id, nombre e iniciales', async ({ client, assert }) => {
    const token = await sesion(client, 'Ada Lovelace')
    const assignees = await responsables(client, token)

    const esperado = ['fullName', 'id', 'initials']

    assert.deepEqual(
      porRespuesta(assignees, (a) => Object.keys(a ?? {}).sort()),
      { creacion: esperado, suelta: esperado, lista: esperado }
    )
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, null)
    const assignees = await responsables(client, token)

    const esperado = { fullName: null, conIniciales: true, conEmail: false }

    assert.deepEqual(
      porRespuesta(assignees, (a) => ({
        fullName: a?.fullName,
        conIniciales: typeof a?.initials === 'string' && a.initials.length > 0,
        conEmail: a !== undefined && 'email' in a,
      })),
      { creacion: esperado, suelta: esperado, lista: esperado }
    )
  })
})