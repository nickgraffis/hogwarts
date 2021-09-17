import { Client, Collection, Expr, Ref, StreamApi, StreamFn } from 'faunadb';
import { Subscription, SubscriptionEventHandlers } from 'faunadb/src/types/Stream';
import Signal from 'mini-signals';

/**
 * A stream of documents.
 * @param client The FaunaDB client.
 * @param documentId The ID of the document to stream.
*/
export default class FaunaStream {
  documentId: number | string
  documentRef: Expr
  client: Client
  onUpdate: Signal
  stream: Subscription<SubscriptionEventHandlers> | null = null
  
  constructor (client: Client, documentId: number | string) {    
    this.documentRef = Ref(Collection("houses"), documentId)
    this.documentId = documentId
    this.client = client  
    this.onUpdate = new Signal()  
    this.initStream()
  }

  initStream () {
    this.stream = this.client.stream.document(this.documentRef)

    this.stream.on('snapshot', (data) => {
      console.log('snapshot? change!!!!', data)
      this.onUpdate.dispatch({
        event: 'snapshot',
        data
      })
    })

    this.stream.on('version', (data: any) => {
      const event = data?.document?.data.history.action
      const id = data?.document?.data.history.id
      console.log('version change!!!!', data)
      this.onUpdate.dispatch({
        id,
        event,
        data: data.document
      })
    })

    this.stream.on('error', (data: any) => {
      console.warn('FauanDB Streaming Error:', data)
      this.onUpdate.dispatch({
        event: 'error',
        data: data.toString()
      })
      if (this.stream) {
        this.stream.close()
        setTimeout(() => {
          this.initStream()
        }, 250)
      }
    })

    this.stream.start()
  }

  destroy () {
    if (this.stream) {
      this.stream.close()
      this.onUpdate.dispatch({
        event: 'destroy',
        data: `Destroying stream for ${this.documentId}.`
      })
      this.onUpdate.detachAll()
    } else {
      this.onUpdate.dispatch({
        event: 'destroy',
        data: `Stream for ${this.documentId} already destroyed.`
      })
      this.onUpdate.detachAll()
    }
  }
}