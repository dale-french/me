import { createElement } from "react"

const applyDarkModeClass = `
(function() {
  try {
    var darkMode = localStorage.getItem('dark');
    if (darkMode === 'true') {
      document.body.classList.add('dark');
		}
  } catch (e) {}
})();
`

export const onRenderBody = ({ setPreBodyComponents }) => {
  const script = createElement("script", {
    dangerouslySetInnerHTML: {
      __html: applyDarkModeClass,
    },
  })
  setPreBodyComponents([script])
}
