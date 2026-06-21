'use client'
import { useState } from 'react'

interface FAQ { q: string; a: string }

export default function ClusterFAQClient({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number|null>(null)

  return (
    <div style={{maxWidth:'800px',margin:'0 auto'}}>
      {faqs.map((f, i) => (
        <div key={i} style={{borderTop:'1px solid rgba(255,255,255,0.07)',padding:'1.5rem 0',borderBottom:i===faqs.length-1?'1px solid rgba(255,255,255,0.07)':'none'}}>
          <div
            onClick={() => setOpen(open===i ? null : i)}
            style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:500,fontSize:'1rem',gap:'1rem',cursor:'pointer',transition:'color .2s',color:open===i?'#c8f247':'#fff'}}
          >
            {f.q}
            <span style={{flexShrink:0,width:'22px',height:'22px',borderRadius:'50%',border:`1px solid ${open===i?'#c8f247':'rgba(255,255,255,0.07)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',color:open===i?'#c8f247':'rgba(255,255,255,0.4)',transform:open===i?'rotate(180deg)':'none',transition:'all .25s'}}>▾</span>
          </div>
          {open===i && (
            <div style={{fontSize:'.88rem',color:'rgba(255,255,255,0.75)',lineHeight:1.75,paddingTop:'.85rem'}}>
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}