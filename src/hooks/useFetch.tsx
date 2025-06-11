import { useEffect, useState } from "react";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  console.log(`url do fetch ${url}`)
 useEffect(() => {

  const fetchedData = async () => {
    try{
    const res = await fetch(url);
    if(!res.ok) throw new Error("Erro ao buscar po dados");
    const jsonData = await res.json();

    setData(jsonData);
    
    // eslint-disable-next-line
    }catch(err: any){
      setError(err.message || "erro desconhecido")
    }finally{
      setLoading(false)
    }
  }
  
  fetchedData()

 },[url])

 return {data, loading ,error}
}
