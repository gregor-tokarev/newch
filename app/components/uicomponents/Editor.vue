<template>
  <div :id="id" class="editor" />
</template>

<script>
import EditorJS from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Header from '@editorjs/header'
import Checklist from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import Image from '@editorjs/image'
import { v4 } from 'uuid'

export default {
  name: 'Editor',
  model: {
    event: 'change',
    prop: 'data'
  },
  props: {
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    id: {
      type: String,
      default: 'editor'
    },
    paddingBottom: {
      type: [Number, String],
      default: 300
    }
  },
  data () {
    return {
      editor: null
    }
  },
  watch: {
    async data (value) {
      await this.editor.isReady
      this.editor && this.read && this.editor.render(value)
    }
  },
  async mounted () {
    await this.editor.isReady
    const paddinger = document.querySelector(`#${this.id} .codex-editor__redactor`)
    if (paddinger) {
      paddinger.style.paddingBottom = this.paddingBottom + 'px'
    }
  },
  created () {
    const vm = this
    this.editor = new EditorJS({
      holderId: vm.id,

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
                const imgRef = bucket.child(`/editorImages/${vm.$user.uid}/` + v4() + '.' + file.name.split('.')[1])
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
  }
}
</script>

<style scoped lang="scss">
.editor {
  width: 100%;

  ::v-deep {
    * {
      color: var(--text) !important;
    }

    .ce-toolbar__content,
    .ce-block__content {
      max-width: 100000px;
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
