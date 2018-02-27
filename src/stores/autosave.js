import * as mobx from 'mobx';
import storage from 'store2'

export default function autosave(store, storageKey, deserialize = x => x) {
  console.log(store, storageKey, deserialize)
  let firstRun = true

  mobx.autorun(`autorun for ${storageKey}`, () => {
    if (firstRun) {
      const existingStore = storage.get(storageKey)

      if (existingStore) {
        mobx.extendObservable(store, deserialize(existingStore))
      }

      firstRun = false
    }

    storage.set(storageKey, mobx.toJS(store))
    console.log(storage)
  })
}