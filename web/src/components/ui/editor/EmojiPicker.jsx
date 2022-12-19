import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function EmojiPicker(){
  return (
    <Picker 
      className="absolute"
      theme="dark"
      data={data}
      showSkinTones={false}
      showPreview={false}
      onSelect={(emoji) => {
        setInputValue(inputValue + emoji.native)
        setShowEmojiPicker(!showEmojiPicker)
        store.dispatch(setFocused(true))
      }}
      exclude={['recent', 'flags']}
    />
  )
}