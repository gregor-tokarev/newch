<template>
  <div id="editor"/>
</template>

<script>
import EditorJS from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Header from '@editorjs/header'
import Checklist from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import Image from '@editorjs/image'

export default {
  name: 'Editor',
  data () {
    return {
      editor: null
    }
  },
  props: {
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  model: {
    event: 'change',
    prop: 'data'
  },
  watch: {
    data (value) {
      this.read && this.editor.render(value)
    }
  },
  async created () {
    const vm = this
    const editor = new EditorJS({
      holderId: 'editor',

      async onChange (api) {
        const body = await api.saver.save()
        vm.$emit('change', body)
      },

      logLevel: 'WARN',
      readOnly: vm.read,

      data: vm.data,
      tools: {
        embed: Embed,
        list: List,
        header: {
          class: Header,
          config: {
            placeholder: vm.read ? undefined : 'Заголовок'
          }
        },
        checklist: Checklist,
        delimiter: Delimiter,
        image: {
          class: Image,
          config: {
            uploader: {
              async uploadByFile (file) {
                const bucket = vm.$fire.storage.ref()
                const imgRef = bucket.child(`/images/${vm.$user.uid}/` + Date.now() + file.name)
                const task = await imgRef.put(file, { contentType: file.type })
                const url = await task.ref.getDownloadURL()

                const ref = vm.$fire.storage.refFromURL(url)
                vm.$emit('addImage', ref)

                return {
                  success: 1,
                  file: {
                    url
                  }
                }
              }
            }
          }
        },
        paragraph: {
          config: {
            placeholder: vm.read ? undefined : 'Текст'
          }
        }
      }
    })

    await editor.isReady
    this.editor = editor
  }
}
</script>

<style scoped lang="scss">
#editor {
  max-width: 750px;
  margin-right: auto;
  margin-left: auto;
  //border-radius: 33px;
  //box-shadow: 0 0 13px 23px rgba(0, 0, 0, 0.25);

  ::v-deep {
    * {
      color: var(--text) !important;
    }

    .ce-toolbar__content,
    .ce-block__content {
      max-width: 750px;
    }

    .ce-block {
      &--selected {
        .ce-block__content {
          background-color: var(--bg) !important;
        }
      }
    }

    .ce-conversion-tool {
      &:hover {
        background-color: initial;
      }

      &__icon {
        background-color: initial;
      }
    }

    .ce-conversion-toolbar {
      background-color: var(--editor-toolbar);
      border: none;

      &__icon {
        background-color: initial;
      }
    }

    .cdx-checklist__item {
      &-checkbox {
        border: none;
      }

      &--checked {
        .cdx-checklist__item-checkbox {
          background-color: var(--accent);
        }
      }
    }

    .ce-toolbar {
      &__settings-btn {
        background-color: var(--bg) !important;
      }
    }

    .ce-inline-toolbar {
      background-color: var(--editor-toolbar);
      border-color: var(--editor-toolbar);

      &__actions {
        background-color: inherit !important;
      }
    }

    .ce-inline-tool {
      &:hover {
        background-color: initial !important;
      }
    }

    .ce-inline-tool-input {
      color: var(--text) !important;
    }
  }
}
</style>
