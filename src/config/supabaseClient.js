import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cdhhjbucwspsckbwbwua.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaGhqYnVjd3Nwc2NrYndid3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMTg3MTYsImV4cCI6MjAzMDY5NDcxNn0._5u7Q_RecIF3ulh3qG3bhC1cPdZUclgdlRYvOpbZliA"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase