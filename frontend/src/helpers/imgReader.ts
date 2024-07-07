function imgReader(file:ArrayBuffer | string | null ):string {

        if (file) {
            const blob = new Blob([file], { type: 'image/png' })
            const url = (window.URL || window.webkitURL).createObjectURL(blob)
        return url
        }

        return ''
}

export default imgReader