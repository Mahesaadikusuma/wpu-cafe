const fetchAPI =  async (url: string, options: RequestInit) => {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers
            
        }, 
        ...options
    })

    const data = await response.json()
    return data
}

export default fetchAPI
    