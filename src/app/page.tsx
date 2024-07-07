"use client"

import { ChangeEvent, useState } from "react"

export default function Home() {
  const [urlList, setUrlList] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [isAsync, setAsync] = useState(false)
  const [result, setResult] = useState(0)

  function onChangeNewUrlInput(e: ChangeEvent<HTMLInputElement>) {
    setNewUrl(e.target.value)
  }

  function addUrl() {
    setUrlList([...urlList, newUrl])
    setNewUrl("")
  }

  async function runTest() {
    const t0 = performance.now()
    if (isAsync) {
      for (const url of urlList) {
        const result = await fetch("http://" + url)
        await result.text()
      }
    } else {
      const promiseList = await urlList.map(async (url) => {
        const result = await fetch("http://" + url)
        return await result.text()
      })
      await Promise.all(promiseList)
    }
    const t1 = performance.now()
    setResult(t1 - t0)
  }

  return (
    <main>
      <div className="flex">
        <input value={newUrl} onChange={onChangeNewUrlInput} />
        <button onClick={addUrl}>추가</button>
      </div>
      <div className="flex gap-4">
        <div>
          <input
            type="radio"
            checked={isAsync}
            onClick={() => setAsync(!isAsync)}
          />
          동기적으로 실행
        </div>
        <br />
        <button onClick={runTest}>테스트 실행</button>
        <div>{result}초</div>
      </div>
      <div>
        {urlList.map((url, index) => (
          <div key={index}>{url}</div>
        ))}
      </div>
    </main>
  )
}
