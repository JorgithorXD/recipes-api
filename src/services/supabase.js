import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://tiyoplsxvxkudtklmxuj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeW9wbHN4dnhrdWR0a2xteHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDE4MTAsImV4cCI6MjAyMzYxNzgxMH0.mxljN8ZTFBElt-PtKk4zG6N1bcm0DKrS93Z8YaSHLwY')

export {
  supabase
}