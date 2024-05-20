import { createClient } from "@supabase/supabase-js";

//Supabase Main
//const supabaseUrl = "https://cdhhjbucwspsckbwbwua.supabase.co";
//const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaGhqYnVjd3Nwc2NrYndid3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMTg3MTYsImV4cCI6MjAzMDY5NDcxNn0._5u7Q_RecIF3ulh3qG3bhC1cPdZUclgdlRYvOpbZliA";

//Supabase Backup
const supabaseUrl = "https://ivltiudjxnrytalzxfwr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bHRpdWRqeG5yeXRhbHp4ZndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMTMzNzgsImV4cCI6MjAzMTc4OTM3OH0.th0QprBpNXFyh3pZ_yUwEsy1ge7fOfNzd7pzTpGRwZE";

//const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
//const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
