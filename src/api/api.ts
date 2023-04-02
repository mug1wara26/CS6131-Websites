export const setLocalStorage = (key: string, data: any) => {
    localStorage.removeItem(key)
    localStorage.setItem(key, data)

    const expiry = new Date().getTime() + 1000 * 60 * 60 * 24 * 7
    const expiryTimesTemp = localStorage.getItem('expiry')
    let expiryTimes;

    if (expiryTimesTemp) expiryTimes = JSON.parse(expiryTimesTemp)
    else expiryTimes = {} as Record<string, number>

    expiryTimes[key] = expiry
    localStorage.setItem('expiry', JSON.stringify(expiryTimes))
}

export const setLocalStorageWithJsonKey = (localStorageKey: string, jsonKey: string, data: any) => {
    const localStorageData = getFromLocalStorage(localStorageKey)
    if (localStorageData) {
        localStorageData[jsonKey] = data
        setLocalStorage(localStorageKey, localStorageData)
    }
}

export const getFromLocalStorage = (key: string) => {
    const expiryTimesTemp = localStorage.getItem('expiry')
    if (expiryTimesTemp) {
        const expiryTimes = JSON.parse(expiryTimesTemp)
        for (const key in expiryTimes) {
            if (expiryTimes[key] < new Date().getTime()) localStorage.removeItem(key)
        }
    }

    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
    else return null
}