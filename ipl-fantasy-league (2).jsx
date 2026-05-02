import { useState } from "react";

const TEAMS = {
  Madhu:  ["Jos Buttler","Prabsimran Singh","Ishan Kishan","Ruturaj Gaikwad","Shubman Gill","Priyansh Arya","Angkrish Raghuvanshi","Travis Head","Yashasvi Jaiswal","Ravindra Jadeja","Mitchell Marsh","Sunil Narine","Axar Patel","Lungi Ngidi","Yuzvendra Chahal"],
  Akshay: ["KL Rahul","Nicholas Pooran","Sai Sudarshan","Virat Kohli","Devdutt Padikkal","Ajinkya Rahane","Shimron Hetmyer","Vaibhav Suryavanshi","Abhishek Sharma","Shivam Dube","Rashid Khan","Krunal Pandya","Noor Ahmed","Mukesh Kumar","Prasidh Krishna"],
  Sunil:  ["Sanju Samson","Tristan Stubbs","Phil Salt","Riyan Parag","Ayush Mhatre","David Miller","Rajat Patidar","Shreyas Iyer","Finn Allen","Harsh Dubey","Washington Sundar","Marco Jansen","Kuldeep Yadav","Arshdeep Singh","Jasprit Bumrah"],
  Yogesh: ["Dhruv Jurel","Tim David","Mohammed Shami","Samir Rizvi","Jofra Archer","Ravi Bishnoi","Cooper Connolly","Sarfaraz Khan","Bhuvneshwar Kumar","Cameron Green","Josh Hazlewood","Mohammed Siraj","Sherfane Rutherford","Deepak Chahar","Harshal Patel"],
};

function calcBat(b) {
  if (!b) return { pts:0, bd:[] };
  let pts=0; const bd=[];
  const {runs=0,balls=0,fours=0,sixes=0,dismissed=true}=b;
  pts+=runs; if(runs>0) bd.push(`${runs}r`);
  if(fours>0){pts+=fours; bd.push(`${fours}×4(+${fours})`);}
  if(sixes>0){pts+=sixes*2; bd.push(`${sixes}×6(+${sixes*2})`);}
  if(runs>=100){pts+=16;bd.push("100+(+16)");}
  else if(runs>=50){pts+=8;bd.push("50+(+8)");}
  else if(runs>=30){pts+=4;bd.push("30+(+4)");}
  if(runs===0&&dismissed){pts-=2;bd.push("duck(-2)");}
  if(balls>=10){const sr=(runs/balls)*100; if(sr>=170){pts+=6;bd.push(`SR${Math.round(sr)}(+6)`);}else if(sr>=150){pts+=4;bd.push(`SR${Math.round(sr)}(+4)`);}}
  return {pts,bd};
}
function calcBowl(b) {
  if (!b) return {pts:0,bd:[]};
  let pts=0; const bd=[];
  const {wkts=0,lbwBold=0,maidens=0,dots=0,balls=0,runs=0}=b;
  if(wkts>0){pts+=wkts*25;bd.push(`${wkts}w(+${wkts*25})`);}
  if(lbwBold>0){pts+=lbwBold*8;bd.push(`${lbwBold}LBW/B(+${lbwBold*8})`);}
  if(wkts>=5){pts+=16;bd.push("5fer(+16)");}else if(wkts>=4){pts+=8;bd.push("4fer(+8)");}else if(wkts>=3){pts+=4;bd.push("3fer(+4)");}
  if(maidens>0){pts+=maidens*12;bd.push(`${maidens}mdn(+${maidens*12})`);}
  if(dots>0){pts+=dots;bd.push(`${dots}dots(+${dots})`);}
  const ov=balls/6;
  if(ov>=2&&balls>0){const eco=runs/ov; if(eco<5){pts+=6;bd.push(`Eco${eco.toFixed(1)}(+6)`);}else if(eco<=7){pts+=4;bd.push(`Eco${eco.toFixed(1)}(+4)`);}}
  return {pts,bd};
}
function calcField(f) {
  if (!f) return {pts:0,bd:[]};
  let pts=0; const bd=[];
  const {catches=0,stumpings=0}=f;
  if(catches>0){pts+=catches*8;bd.push(`${catches}c(+${catches*8})`);}
  if(catches>=3){pts+=4;bd.push("3+c(+4)");}
  if(stumpings>0){pts+=stumpings*12;bd.push(`${stumpings}st(+${stumpings*12})`);}
  return {pts,bd};
}

const RAW = [
  {id:"m9",num:9,date:"Apr 4",teams:"GT vs RR",result:"RR won by 6 runs",players:{
    // RR innings
    "Vaibhav Suryavanshi":{bat:{runs:39,balls:14,fours:2,sixes:4,dismissed:true}},
    "Yashasvi Jaiswal":  {bat:{runs:55,balls:36,fours:5,sixes:2,dismissed:true}},
    "Riyan Parag":       {bat:{runs:9, balls:7, fours:1,sixes:1,dismissed:true}},
    "Shimron Hetmyer":   {bat:{runs:21,balls:12,fours:1,sixes:2,dismissed:true}},
    "Dhruv Jurel":       {bat:{runs:75,balls:42,fours:5,sixes:4,dismissed:true},field:{catches:1,stumpings:0}},
    "Ravindra Jadeja":   {bat:{runs:5, balls:5, fours:0,sixes:0,dismissed:false}},
    "Jofra Archer":      {bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:18,runs:28}},
    "Ravi Bishnoi":      {bowl:{wkts:4,lbwBold:0,maidens:0,dots:10,balls:24,runs:41}},
    "Sandeep Sharma":    {bowl:{wkts:1,lbwBold:1,maidens:0,dots:6,balls:24,runs:35}},
    "Nandre Burger":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:18,runs:30}},
    // GT innings
    "Shubman Gill":      {},
    "Sai Sudarshan":     {bat:{runs:73,balls:44,fours:6,sixes:3,dismissed:true}},
    "Jos Buttler":       {bat:{runs:0, balls:3, fours:0,sixes:0,dismissed:true}},
    "Washington Sundar": {bat:{runs:3, balls:4, fours:0,sixes:0,dismissed:true}},
    "Rashid Khan":       {bat:{runs:24,balls:16,fours:1,sixes:2,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:24,runs:42}},
    "Kagiso Rabada":     {bat:{runs:18,balls:10,fours:1,sixes:1,dismissed:false},bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:24,runs:42}},
    "Mohammed Siraj":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:18,runs:38},field:{catches:2,stumpings:0}},
    "Prasidh Krishna":   {bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:18,runs:40}},
  }},
  {id:"m10",num:10,date:"Apr 5",teams:"SRH vs LSG",result:"LSG won by 5 wkts",players:{
    "Travis Head":      {bat:{runs:7,balls:8,fours:1,sixes:0,dismissed:true}},
    "Ishan Kishan":     {bat:{runs:1,balls:4,fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:1}},
    "Heinrich Klaasen": {bat:{runs:62,balls:41,fours:5,sixes:2,dismissed:true}},
    "Nitish Kumar Reddy":{bat:{runs:56,balls:33,fours:3,sixes:5,dismissed:true}},
    "Aniket Verma":     {bat:{runs:2,balls:5,fours:0,sixes:0,dismissed:false}},
    "Harshal Patel":    {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:18,runs:48}},
    "Harsh Dubey":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:8,balls:24,runs:18}},
    "Abhishek Sharma":  {bat:{runs:0,balls:2,fours:0,sixes:0,dismissed:true}},
    "Liam Livingstone": {bat:{runs:14,balls:20,fours:0,sixes:1,dismissed:true}},
    "Mitchell Marsh":   {bat:{runs:14,balls:12,fours:1,sixes:1,dismissed:true}},
    "Aiden Markram":    {bat:{runs:45,balls:27,fours:6,sixes:2,dismissed:true}},
    "Rishabh Pant":     {bat:{runs:68,balls:50,fours:9,sixes:0,dismissed:false},field:{catches:1,stumpings:1}},
    "Nicholas Pooran":  {bat:{runs:4,balls:4,fours:0,sixes:0,dismissed:true}},
    "Abdul Samad":      {bat:{runs:16,balls:12,fours:2,sixes:0,dismissed:true}},
    "Ayush Badoni":     {bat:{runs:37,balls:22,fours:5,sixes:1,dismissed:true}},
    "Mohammed Shami":   {bowl:{wkts:2,lbwBold:0,maidens:1,dots:14,balls:24,runs:9}},
    "Digvesh Rathi":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:18,runs:28}},
    "Prince Yadav":     {bowl:{wkts:2,lbwBold:1,maidens:0,dots:8,balls:18,runs:19}},
    "Avesh Khan":       {bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:18,runs:32}},
  }},
  {id:"m11",num:11,date:"Apr 5",teams:"RCB vs CSK",result:"RCB won by 43 runs",players:{
    "Phil Salt":        {bat:{runs:46,balls:30,fours:5,sixes:2,dismissed:true}},
    "Virat Kohli":      {bat:{runs:28,balls:18,fours:3,sixes:1,dismissed:true}},
    "Devdutt Padikkal": {bat:{runs:50,balls:29,fours:5,sixes:2,dismissed:true}},
    "Rajat Patidar":    {bat:{runs:48,balls:19,fours:1,sixes:6,dismissed:false}},
    "Tim David":        {bat:{runs:70,balls:25,fours:3,sixes:8,dismissed:false}},
    "Jitesh Sharma":    {field:{catches:1,stumpings:1}},
    "Krunal Pandya":    {bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:24,runs:30}},
    "Bhuvneshwar Kumar":{bowl:{wkts:3,lbwBold:2,maidens:0,dots:11,balls:24,runs:41}},
    "Suyash Sharma":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:28}},
    "Jacob Duffy":      {bowl:{wkts:2,lbwBold:1,maidens:0,dots:8,balls:24,runs:28}},
    "Sanju Samson":     {bat:{runs:9,balls:5,fours:1,sixes:0,dismissed:true}},
    "Ruturaj Gaikwad":  {bat:{runs:7,balls:9,fours:1,sixes:0,dismissed:true}},
    "Ayush Mhatre":     {bat:{runs:1,balls:2,fours:0,sixes:0,dismissed:true}},
    "Sarfaraz Khan":    {bat:{runs:50,balls:25,fours:8,sixes:2,dismissed:true}},
    "Shivam Dube":      {bat:{runs:18,balls:12,fours:2,sixes:1,dismissed:true}},
    "Prashant Veer":    {bat:{runs:43,balls:29,fours:6,sixes:1,dismissed:true}},
    "Jamie Overton":    {bat:{runs:37,balls:16,fours:4,sixes:2,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:18,runs:48}},
    "Anshul Kamboj":    {bowl:{wkts:0,lbwBold:0,maidens:0,dots:6,balls:18,runs:44}},
    "Noor Ahmed":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:18,runs:42}},
  }},
  {id:"m12",num:12,date:"Apr 6",teams:"KKR vs PBKS",result:"No result (rain)",players:{
    "Finn Allen":       {bat:{runs:0,balls:4,fours:0,sixes:0,dismissed:false}},
    "Sunil Narine":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:2,balls:6,runs:8}},
    "Marco Jansen":     {bowl:{wkts:2,lbwBold:1,maidens:0,dots:2,balls:6,runs:5}},
    "Arshdeep Singh":   {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:3,runs:8}},
    "Yuzvendra Chahal": {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:4,runs:12}},
  }},
  {id:"m13",num:13,date:"Apr 7",teams:"RR vs MI",result:"RR won by 27 runs (D/L)",players:{
    "Yashasvi Jaiswal":  {bat:{runs:77,balls:32,fours:10,sixes:4,dismissed:false}},
    "Vaibhav Suryavanshi":{bat:{runs:39,balls:14,fours:1,sixes:5,dismissed:true}},
    "Dhruv Jurel":       {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:1}},
    "Riyan Parag":       {bat:{runs:20,balls:10,fours:1,sixes:2,dismissed:true}},
    "Shimron Hetmyer":   {bat:{runs:6,balls:4,fours:0,sixes:0,dismissed:false}},
    "Jofra Archer":      {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:12,runs:22},field:{catches:1,stumpings:0}},
    "Ravi Bishnoi":      {bowl:{wkts:2,lbwBold:1,maidens:0,dots:9,balls:18,runs:26}},
    "Sandeep Sharma":    {bowl:{wkts:2,lbwBold:0,maidens:0,dots:8,balls:18,runs:26}},
    "Nandre Burger":     {bowl:{wkts:2,lbwBold:0,maidens:0,dots:7,balls:18,runs:21}},
    "Trent Boult":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:2,balls:6,runs:22}},
    "Deepak Chahar":     {bat:{runs:6,balls:4,fours:1,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:6,runs:22}},
    "Jasprit Bumrah":    {bat:{runs:5,balls:3,fours:1,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:6,balls:18,runs:32}},
    "Rohit Sharma":      {bat:{runs:0,balls:3,fours:0,sixes:0,dismissed:true}},
    "Ryan Rickelton":    {bat:{runs:0,balls:3,fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Tilak Varma":       {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true}},
    "Hardik Pandya":     {bat:{runs:9,balls:6,fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:12,runs:17}},
    "Suryakumar Yadav":  {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true}},
    "Sherfane Rutherford":{bat:{runs:25,balls:13,fours:0,sixes:3,dismissed:true}},
    "Shardul Thakur":    {bat:{runs:8,balls:7,fours:1,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:4,balls:12,runs:36}},
  }},
  {id:"m14",num:14,date:"Apr 8",teams:"DC vs GT",result:"GT won by 1 run",players:{
    "Shubman Gill":      {bat:{runs:70,balls:45,fours:5,sixes:5,dismissed:true},field:{catches:1,stumpings:0}},
    "Jos Buttler":       {bat:{runs:52,balls:27,fours:3,sixes:5,dismissed:true}},
    "Washington Sundar": {bat:{runs:55,balls:32,fours:4,sixes:3,dismissed:true}},
    "Rashid Khan":       {bowl:{wkts:3,lbwBold:0,maidens:0,dots:10,balls:24,runs:17}},
    "Kagiso Rabada":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:18,runs:35}},
    "Mohammed Siraj":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:4,balls:18,runs:46}},
    "Prasidh Krishna":   {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:12,runs:28}},
    "Sai Sudarshan":     {bat:{runs:0,balls:4,fours:0,sixes:0,dismissed:true}},
    "KL Rahul":          {bat:{runs:92,balls:52,fours:7,sixes:5,dismissed:true},field:{catches:1,stumpings:1}},
    "Axar Patel":        {bat:{runs:2,balls:3,fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:6,balls:24,runs:38}},
    "David Miller":      {bat:{runs:41,balls:20,fours:2,sixes:3,dismissed:false}},
    "Tristan Stubbs":    {bat:{runs:41,balls:24,fours:3,sixes:1,dismissed:true}},
    "Samir Rizvi":       {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true}},
    "Lungi Ngidi":       {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:24}},
    "Kuldeep Yadav":     {bowl:{wkts:1,lbwBold:1,maidens:0,dots:7,balls:24,runs:38}},
    "Mukesh Kumar":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:4,balls:24,runs:55}},
  }},
  {id:"m15",num:15,date:"Apr 9",teams:"KKR vs LSG",result:"LSG won by 3 wkts",players:{
    "Ajinkya Rahane":    {bat:{runs:41,balls:24,fours:4,sixes:2,dismissed:true}},
    "Finn Allen":        {bat:{runs:9,balls:8,fours:1,sixes:0,dismissed:true}},
    "Angkrish Raghuvanshi":{bat:{runs:45,balls:33,fours:3,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
    "Cameron Green":     {bat:{runs:19,balls:22,fours:1,sixes:1,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:3,balls:12,runs:22}},
    "Rinku Singh":       {bat:{runs:0,balls:2,fours:0,sixes:0,dismissed:true}},
    "Sunil Narine":      {bowl:{wkts:1,lbwBold:0,maidens:1,dots:14,balls:24,runs:13}},
    "Mitchell Marsh":    {bat:{runs:15,balls:11,fours:1,sixes:1,dismissed:true}},
    "Aiden Markram":     {bat:{runs:23,balls:11,fours:2,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
    "Rishabh Pant":      {bat:{runs:18,balls:15,fours:1,sixes:0,dismissed:true},field:{catches:0,stumpings:1}},
    "Nicholas Pooran":   {bat:{runs:10,balls:8,fours:1,sixes:0,dismissed:true}},
    "Abdul Samad":       {bat:{runs:12,balls:10,fours:1,sixes:0,dismissed:true}},
    "Ayush Badoni":      {bat:{runs:54,balls:34,fours:7,sixes:2,dismissed:true}},
    "Mohammed Shami":    {bat:{runs:1,balls:3,fours:0,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:34}},
    "Digvesh Rathi":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:25},field:{catches:1,stumpings:0}},
    "Prince Yadav":      {bowl:{wkts:1,lbwBold:1,maidens:0,dots:6,balls:18,runs:19}},
    "Avesh Khan":        {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:18,runs:34}},
  }},
  {id:"m16",num:16,date:"Apr 10",teams:"RR vs RCB",result:"RR won by 6 wkts",players:{
    "Phil Salt":         {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true}},
    "Virat Kohli":       {bat:{runs:32,balls:16,fours:7,sixes:0,dismissed:true}},
    "Devdutt Padikkal":  {bat:{runs:14,balls:10,fours:2,sixes:0,dismissed:true}},
    "Rajat Patidar":     {bat:{runs:63,balls:40,fours:4,sixes:4,dismissed:true}},
    "Tim David":         {bat:{runs:30,balls:18,fours:1,sixes:2,dismissed:true}},
    "Jitesh Sharma":     {field:{catches:1,stumpings:0}},
    "Krunal Pandya":     {bat:{runs:0,balls:2,fours:0,sixes:0,dismissed:true},bowl:{wkts:2,lbwBold:0,maidens:0,dots:5,balls:24,runs:30}},
    "Bhuvneshwar Kumar": {bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:32}},
    "Josh Hazlewood":    {bowl:{wkts:2,lbwBold:0,maidens:0,dots:8,balls:24,runs:38}},
    "Suyash Sharma":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:18,runs:32}},
    "Venkatesh Iyer":    {bat:{runs:29,balls:15,fours:1,sixes:2,dismissed:false}},
    "Yashasvi Jaiswal":  {bat:{runs:13,balls:9,fours:2,sixes:0,dismissed:true}},
    "Vaibhav Suryavanshi":{bat:{runs:78,balls:26,fours:8,sixes:7,dismissed:true}},
    "Dhruv Jurel":       {bat:{runs:81,balls:43,fours:8,sixes:3,dismissed:false},field:{catches:0,stumpings:1}},
    "Riyan Parag":       {bat:{runs:3,balls:5,fours:0,sixes:0,dismissed:true}},
    "Shimron Hetmyer":   {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true}},
    "Ravindra Jadeja":   {bat:{runs:24,balls:16,fours:2,sixes:1,dismissed:false}},
    "Jofra Archer":      {bowl:{wkts:0,lbwBold:0,maidens:0,dots:8,balls:24,runs:30}},
    "Ravi Bishnoi":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:8,balls:24,runs:28}},
    "Sandeep Sharma":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:24,runs:32}},
    "Nandre Burger":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:18,runs:28}},
    "Rasikh Dar":        {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:18,runs:30}},
    "Nuwan Thushara":    {bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:12,runs:22}},
    "Yuzvendra Chahal":  {bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:12,runs:25}},
  }},
  {id:"m18",num:18,date:"Apr 11",teams:"CSK vs DC",result:"CSK won by 23 runs",players:{
    // CSK innings
    "Sanju Samson":     {bat:{runs:115,balls:56,fours:15,sixes:4,dismissed:false},field:{catches:0,stumpings:0}},
    "Ruturaj Gaikwad":  {bat:{runs:15,balls:18,fours:1,sixes:0,dismissed:true}},
    "Ayush Mhatre":     {bat:{runs:59,balls:36,fours:6,sixes:2,dismissed:false}},
    "Shivam Dube":      {bat:{runs:20,balls:10,fours:2,sixes:1,dismissed:false}},
    "Sarfaraz Khan":    {bat:{runs:0,balls:0,fours:0,sixes:0,dismissed:false}},
    "Noor Ahmed":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:18,runs:38}},
    "Khaleel Ahmed":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:18,runs:32}},
    // DC innings
    "KL Rahul":         {bat:{runs:18,balls:14,fours:2,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "David Miller":     {bat:{runs:17,balls:14,fours:1,sixes:1,dismissed:true}},
    "Tristan Stubbs":   {bat:{runs:60,balls:38,fours:4,sixes:2,dismissed:true}},
    "Axar Patel":       {bat:{runs:0,balls:0,fours:0,sixes:0,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:24,runs:32}},
    "Samir Rizvi":      {bat:{runs:12,balls:9,fours:1,sixes:0,dismissed:true}},
    "Lungi Ngidi":      {bat:{runs:2,balls:2,fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:18,runs:38}},
    "Kuldeep Yadav":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:24,runs:40}},
    "Mukesh Kumar":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:18,runs:42}},
  }},
  {id:"m17",num:17,date:"Apr 11",teams:"PBKS vs SRH",result:"PBKS won by 6 wkts",players:{
    "Travis Head":       {bat:{runs:38,balls:23,fours:5,sixes:1,dismissed:true}},
    "Abhishek Sharma":   {bat:{runs:74,balls:28,fours:5,sixes:8,dismissed:true}},
    "Ishan Kishan":      {bat:{runs:27,balls:17,fours:3,sixes:1,dismissed:true},field:{catches:0,stumpings:1}},
    "Heinrich Klaasen":  {bat:{runs:39,balls:33,fours:1,sixes:1,dismissed:true}},
    "Aniket Verma":      {bat:{runs:18,balls:9,fours:1,sixes:1,dismissed:true}},
    "Nitish Kumar Reddy":{bat:{runs:10,balls:8,fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Harshal Patel":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:18,runs:48}},
    "Harsh Dubey":       {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:24,runs:38}},
    "Priyansh Arya":     {bat:{runs:57,balls:20,fours:5,sixes:5,dismissed:true}},
    "Prabsimran Singh":  {bat:{runs:51,balls:25,fours:4,sixes:4,dismissed:true}},
    "Shreyas Iyer":      {bat:{runs:69,balls:33,fours:5,sixes:5,dismissed:false}},
    "Cooper Connolly":   {bat:{runs:11,balls:12,fours:1,sixes:0,dismissed:true}},
    "Arshdeep Singh":    {bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:24,runs:50}},
    "Marco Jansen":      {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:18,runs:38}},
    "Yuzvendra Chahal":  {bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:18,runs:42}},
    "Vyshak Vijaykumar": {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:18,runs:35}},
    "Shashank Singh":    {bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:18,runs:20}},
  }},
];

const TEAMS_W2 = {
  Madhu:  ["Jos Buttler","Ishan Kishan","Ruturaj Gaikwad","Shubman Gill","Priyansh Arya","Angkrish Raghuvanshi","Travis Head","Yashasvi Jaiswal","Sunil Narine","Axar Patel","Shivam Dube","Jitesh Sharma","Ryan Rickelton","Rohit Sharma","Hardik Pandya"],
  Akshay: ["Jamie Overton","Sai Sudarshan","Virat Kohli","Devdutt Padikkal","Ajinkya Rahane","Ayush Badoni","Vaibhav Suryavanshi","Abhishek Sharma","Jacob Duffy","Rashid Khan","Krunal Pandya","Noor Ahmed","Prasidh Krishna","Heinrich Klaasen","Shardul Thakur"],
  Sunil:  ["Sanju Samson","Prince Yadav","Phil Salt","Ayush Mhatre","Anshul Kamboj","Rajat Patidar","Finn Allen","Harsh Dubey","Digvesh Rathi","Marco Jansen","Jasprit Bumrah","Suryakumar Yadav","Tilak Varma","Mitchell Santner","Kagiso Rabada"],
  Yogesh: ["Dhruv Jurel","Tim David","Mohammed Shami","Samir Rizvi","Mohammed Siraj","Ravi Bishnoi","Sarfaraz Khan","Bhuvneshwar Kumar","Cameron Green","Josh Hazlewood","Deepak Chahar","Pathum Nissanka","Rishabh Pant","Suyash Sharma","David Miller"],
};

// Week 3 rosters — frozen from W2 auction
const TEAMS_W3 = {
  Madhu:  ["Jos Buttler","Prabsimran Singh","Ishan Kishan","Hardik Pandya","Shubman Gill","Priyansh Arya","Axar Patel","Sandeep Sharma","Yashasvi Jaiswal","Mitchell Marsh","Ruturaj Gaikwad","Sunil Narine","Prince Yadav","Nandre Burger","Sakib Hussain"],
  Akshay: ["KL Rahul","Vaibhav Suryavanshi","Sai Sudarshan","Virat Kohli","Devdutt Padikkal","Rashid Khan","Krunal Pandya","Prasidh Krishna","Aiden Markram","Heinrich Klaasen","Abhishek Sharma","Harsh Dubey","Kagiso Rabada","Praful Hinge","Nicholas Pooran"],
  Sunil:  ["Sanju Samson","Jasprit Bumrah","Phil Salt","Marco Jansen","Ayush Mhatre","Anshul Kamboj","Rajat Patidar","Shreyas Iyer","Kuldeep Yadav","Arshdeep Singh","Travis Head","Riyan Parag","Avesh Khan","Jofra Archer","Deepak Chahar","Sarfaraz Khan"],
  Yogesh: ["Dhruv Jurel","Sherfane Rutherford","Tim David","Mohammed Shami","Samir Rizvi","Ravindra Jadeja","Josh Hazlewood","Ravi Bishnoi","Cooper Connolly","Suyash Sharma","Quinton de Kock","Suryakumar Yadav","Cameron Green","Mohammed Siraj","Digvesh Rathi"],
};

const PLAYER_IPL_TEAM_W3 = {
  // Madhu W3
  "Jos Buttler":"GT","Prabsimran Singh":"PBKS","Ishan Kishan":"SRH","Hardik Pandya":"MI",
  "Shubman Gill":"GT","Priyansh Arya":"PBKS","Axar Patel":"DC","Sandeep Sharma":"RR",
  "Yashasvi Jaiswal":"RR","Mitchell Marsh":"LSG","Ruturaj Gaikwad":"CSK","Sunil Narine":"KKR",
  "Prince Yadav":"LSG","Nandre Burger":"RR","Sakib Hussain":"SRH",
  // Akshay W3
  "KL Rahul":"DC","Vaibhav Suryavanshi":"RR","Sai Sudarshan":"GT","Virat Kohli":"RCB",
  "Devdutt Padikkal":"RCB","Rashid Khan":"GT","Krunal Pandya":"RCB","Prasidh Krishna":"GT",
  "Aiden Markram":"DC","Heinrich Klaasen":"SRH","Abhishek Sharma":"SRH","Harsh Dubey":"SRH",
  "Kagiso Rabada":"GT","Praful Hinge":"SRH","Nicholas Pooran":"LSG",
  // Sunil W3
  "Sanju Samson":"CSK","Jasprit Bumrah":"MI","Phil Salt":"RCB","Marco Jansen":"PBKS",
  "Ayush Mhatre":"CSK","Anshul Kamboj":"CSK","Rajat Patidar":"RCB","Shreyas Iyer":"PBKS",
  "Kuldeep Yadav":"DC","Arshdeep Singh":"PBKS","Travis Head":"SRH","Riyan Parag":"RR",
  "Avesh Khan":"LSG","Jofra Archer":"RR","Deepak Chahar":"MI","Sarfaraz Khan":"CSK",
  // Yogesh W3
  "Dhruv Jurel":"RR","Sherfane Rutherford":"MI","Tim David":"RCB","Mohammed Shami":"LSG",
  "Samir Rizvi":"DC","Ravindra Jadeja":"RR","Josh Hazlewood":"RCB","Ravi Bishnoi":"RR",
  "Cooper Connolly":"PBKS","Suyash Sharma":"RCB","Quinton de Kock":"MI","Suryakumar Yadav":"MI",
  "Cameron Green":"KKR","Mohammed Siraj":"GT","Digvesh Rathi":"LSG",
};

// Week 4 rosters — frozen from W3 auction
const TEAMS_W4 = {
  Madhu:  ["Jos Buttler","Ishan Kishan","Shubman Gill","Priyansh Arya","Axar Patel","Yashasvi Jaiswal","Ruturaj Gaikwad","Jacob Bethell","Mitchell Marsh","Riyan Parag","Hardik Pandya","Kagiso Rabada","Noor Ahmed","Rasikh Dar","Arshdeep Singh"],
  Akshay: ["KL Rahul","Vaibhav Suryavanshi","Sai Sudarshan","Virat Kohli","Devdutt Padikkal","Krunal Pandya","Prasidh Krishna","Heinrich Klaasen","Cooper Connolly","Dhruv Jurel","Bhuvneshwar Kumar","Akeal Hosein","Ashwani Kumar","Varun Chakravarthy","Tim Seifert"],
  Sunil:  ["Sanju Samson","Jasprit Bumrah","Rajat Patidar","Shreyas Iyer","Travis Head","Jofra Archer","Sarfaraz Khan","Abhishek Sharma","Nitish Rana","Josh Inglis","Rashid Khan","Samir Rizvi","Nandre Burger","Suyash Sharma","Kuldeep Yadav"],
  Yogesh: ["Sherfane Rutherford","Tim David","Josh Hazlewood","Ravi Bishnoi","Quinton de Kock","Suryakumar Yadav","Mohammed Siraj","Tilak Varma","Naman Dhir","Phil Salt","Prabsimran Singh","Jamie Overton","Pat Cummins","Anshul Kamboj","AM Ghazanfar"],
};

const PLAYER_IPL_TEAM_W4 = {
  // Madhu W4
  "Jos Buttler":"GT","Ishan Kishan":"SRH","Shubman Gill":"GT","Priyansh Arya":"PBKS",
  "Axar Patel":"DC","Yashasvi Jaiswal":"RR","Ruturaj Gaikwad":"CSK","Jacob Bethell":"RCB",
  "Mitchell Marsh":"LSG","Riyan Parag":"RR","Hardik Pandya":"MI","Kagiso Rabada":"GT",
  "Noor Ahmed":"CSK","Rasikh Dar":"RCB","Arshdeep Singh":"PBKS",
  // Akshay W4
  "KL Rahul":"DC","Vaibhav Suryavanshi":"RR","Sai Sudarshan":"GT","Virat Kohli":"RCB",
  "Devdutt Padikkal":"RCB","Krunal Pandya":"RCB","Prasidh Krishna":"GT","Heinrich Klaasen":"SRH",
  "Cooper Connolly":"PBKS","Dhruv Jurel":"RR","Bhuvneshwar Kumar":"RCB","Akeal Hosein":"CSK",
  "Ashwani Kumar":"MI","Varun Chakravarthy":"KKR","Tim Seifert":"KKR",
  // Sunil W4
  "Sanju Samson":"CSK","Jasprit Bumrah":"MI","Rajat Patidar":"RCB","Shreyas Iyer":"PBKS",
  "Travis Head":"SRH","Jofra Archer":"RR","Sarfaraz Khan":"CSK","Abhishek Sharma":"SRH",
  "Nitish Rana":"DC","Josh Inglis":"LSG","Rashid Khan":"GT","Samir Rizvi":"DC",
  "Nandre Burger":"RR","Suyash Sharma":"RCB","Kuldeep Yadav":"DC",
  // Yogesh W4
  "Sherfane Rutherford":"MI","Tim David":"RCB","Josh Hazlewood":"RCB","Ravi Bishnoi":"RR",
  "Quinton de Kock":"MI","Suryakumar Yadav":"MI","Mohammed Siraj":"GT","Tilak Varma":"MI",
  "Naman Dhir":"MI","Phil Salt":"RCB","Prabsimran Singh":"PBKS","Jamie Overton":"CSK",
  "Pat Cummins":"SRH","Anshul Kamboj":"CSK","AM Ghazanfar":"MI",
};

const RAW_W4 = [
  {id:"m37",num:37,date:"Apr 27",teams:"CSK vs GT",result:"GT won by 8 wkts",players:{
    // CSK innings — 158/7
    "Sanju Samson":      {bat:{runs:11,balls:15,fours:2,sixes:0,dismissed:true},field:{catches:0,stumpings:1}},
    "Ruturaj Gaikwad":   {bat:{runs:74,balls:60,fours:6,sixes:4,dismissed:false}},
    "Sarfaraz Khan":     {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Akeal Hosein":      {bat:{runs:0, balls:0, fours:0,sixes:0,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:22,runs:46}},
    "Noor Ahmed":        {bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:24,runs:29}},
    "Jamie Overton":     {bat:{runs:18,balls:6, fours:3,sixes:1,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:2,balls:12,runs:28}},
    "Anshul Kamboj":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:10,balls:18,runs:16}},
    // GT innings — 162/2
    "Sai Sudarshan":     {bat:{runs:87,balls:46,fours:4,sixes:7,dismissed:true}},
    "Shubman Gill":      {bat:{runs:33,balls:23,fours:1,sixes:3,dismissed:true},field:{catches:1,stumpings:0}},
    "Jos Buttler":       {bat:{runs:39,balls:30,fours:4,sixes:1,dismissed:false},field:{catches:1,stumpings:0}},
    "Kagiso Rabada":     {bowl:{wkts:3,lbwBold:0,maidens:0,dots:15,balls:24,runs:25}},
    "Mohammed Siraj":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:14,balls:24,runs:23}},
    "Rashid Khan":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:6,runs:21}},
  }},
  {id:"m38",num:38,date:"Apr 27",teams:"LSG vs KKR",result:"KKR won (Super Over)",players:{
    // KKR innings — 155/7
    "Tim Seifert":         {bat:{runs:0, balls:3, fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Varun Chakravarthy":  {bowl:{wkts:2,lbwBold:0,maidens:0,dots:10,balls:24,runs:33}},
    // LSG innings — 155/8
    "Mitchell Marsh":      {bat:{runs:2, balls:3, fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Aiden Markram":       {bat:{runs:31,balls:27,fours:2,sixes:1,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:12,runs:9},field:{catches:1,stumpings:0}},
  }},
  {id:"m39",num:39,date:"Apr 28",teams:"RCB vs DC",result:"RCB won by 9 wkts",players:{
    // DC innings — 75 all out
    "KL Rahul":          {bat:{runs:1, balls:3, fours:0,sixes:0,dismissed:true}},
    "Nitish Rana":       {bat:{runs:1, balls:9, fours:0,sixes:0,dismissed:true}},
    "Samir Rizvi":       {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Axar Patel":        {bat:{runs:0, balls:3, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:6,runs:5}},
    "Kuldeep Yadav":     {bat:{runs:3, balls:11,fours:0,sixes:0,dismissed:true}},
    "Bhuvneshwar Kumar": {bowl:{wkts:3,lbwBold:0,maidens:0,dots:15,balls:18,runs:5}},
    "Krunal Pandya":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:4,balls:12,runs:9}},
    "Suyash Sharma":     {bowl:{wkts:1,lbwBold:0,maidens:1,dots:20,balls:24,runs:7}},
    "Rasikh Dar":        {bowl:{wkts:1,lbwBold:0,maidens:0,dots:3,balls:12,runs:21}},
    // RCB innings — 77/1
    "Jacob Bethell":     {bat:{runs:20,balls:11,fours:1,sixes:2,dismissed:true}},
    "Virat Kohli":       {bat:{runs:23,balls:15,fours:1,sixes:2,dismissed:false}},
    "Devdutt Padikkal":  {bat:{runs:34,balls:13,fours:3,sixes:3,dismissed:false},field:{catches:2,stumpings:0}},
    "Josh Hazlewood":    {bowl:{wkts:4,lbwBold:0,maidens:0,dots:15,balls:21,runs:12}},
  }},
  {id:"m40",num:40,date:"Apr 28",teams:"PBKS vs RR",result:"RR won by 6 wkts",players:{
    // PBKS innings — 222/4
    "Prabsimran Singh":   {bat:{runs:59,balls:44,fours:6,sixes:1,dismissed:true}},
    "Priyansh Arya":      {bat:{runs:29,balls:11,fours:5,sixes:1,dismissed:true}},
    "Cooper Connolly":    {bat:{runs:30,balls:14,fours:2,sixes:3,dismissed:true}},
    "Shreyas Iyer":       {bat:{runs:30,balls:27,fours:1,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Arshdeep Singh":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:24,runs:68}},
    "Jofra Archer":       {bowl:{wkts:1,lbwBold:0,maidens:0,dots:10,balls:24,runs:40}},
    "Nandre Burger":      {bowl:{wkts:1,lbwBold:0,maidens:0,dots:4,balls:24,runs:59},field:{catches:1,stumpings:0}},
    // RR innings — 228/4
    "Yashasvi Jaiswal":   {bat:{runs:51,balls:27,fours:7,sixes:1,dismissed:true}},
    "Vaibhav Suryavanshi":{bat:{runs:43,balls:16,fours:3,sixes:5,dismissed:true}},
    "Dhruv Jurel":        {bat:{runs:16,balls:20,fours:0,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Riyan Parag":        {bat:{runs:29,balls:16,fours:2,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
  }},
  {id:"m41",num:41,date:"Apr 29",teams:"MI vs SRH",result:"SRH won by 6 wkts",players:{
    // MI innings — 243/5
    "Suryakumar Yadav":  {bat:{runs:5, balls:5, fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Naman Dhir":        {bat:{runs:22,balls:17,fours:3,sixes:0,dismissed:true}},
    "Hardik Pandya":     {bat:{runs:31,balls:15,fours:2,sixes:2,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:22,runs:39}},
    "Tilak Varma":       {bat:{runs:7, balls:5, fours:0,sixes:1,dismissed:true}},
    "AM Ghazanfar":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:5,balls:24,runs:51}},
    "Ashwani Kumar":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:0,balls:12,runs:41}},
    "Jasprit Bumrah":    {bowl:{wkts:0,lbwBold:0,maidens:0,dots:6,balls:24,runs:54}},
    // SRH innings — 249/4
    "Abhishek Sharma":   {bat:{runs:45,balls:24,fours:4,sixes:3,dismissed:true},field:{catches:1,stumpings:0}},
    "Travis Head":       {bat:{runs:76,balls:30,fours:4,sixes:8,dismissed:true}},
    "Ishan Kishan":      {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Heinrich Klaasen":  {bat:{runs:65,balls:30,fours:7,sixes:4,dismissed:false},field:{catches:2,stumpings:0}},
    "Pat Cummins":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:24,runs:39}},
  }},
  {id:"m42",num:42,date:"Apr 30",teams:"RCB vs GT",result:"GT won by 4 wkts",players:{
    // RCB innings — 155 all out
    "Jacob Bethell":     {bat:{runs:5, balls:5, fours:1,sixes:0,dismissed:true}},
    "Virat Kohli":       {bat:{runs:28,balls:13,fours:5,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Devdutt Padikkal":  {bat:{runs:40,balls:24,fours:5,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
    "Rajat Patidar":     {bat:{runs:19,balls:15,fours:2,sixes:1,dismissed:true}},
    "Tim David":         {bat:{runs:9, balls:6, fours:0,sixes:1,dismissed:true}},
    "Krunal Pandya":     {bat:{runs:4, balls:4, fours:1,sixes:0,dismissed:true}},
    "Bhuvneshwar Kumar": {bat:{runs:15,balls:15,fours:2,sixes:0,dismissed:false},bowl:{wkts:3,lbwBold:0,maidens:0,dots:11,balls:24,runs:28}},
    "Josh Hazlewood":    {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:56},field:{catches:1,stumpings:0}},
    "Suyash Sharma":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:23,runs:44}},
    "Kagiso Rabada":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:10,balls:24,runs:44}},
    // GT innings — 158/6
    "Shubman Gill":      {bat:{runs:43,balls:18,fours:4,sixes:3,dismissed:true}},
    "Jos Buttler":       {bat:{runs:39,balls:19,fours:2,sixes:4,dismissed:true},field:{catches:1,stumpings:0}},
    "Sai Sudarshan":     {bat:{runs:6, balls:5, fours:1,sixes:0,dismissed:true},field:{catches:2,stumpings:0}},
    "Rashid Khan":       {bat:{runs:7, balls:6, fours:1,sixes:0,dismissed:false},bowl:{wkts:2,lbwBold:0,maidens:0,dots:15,balls:24,runs:19},field:{catches:2,stumpings:0}},
    "Mohammed Siraj":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:12,balls:24,runs:38}},
  }},
];

const RAW_W3 = [
  {id:"m28",num:28,date:"Apr 20",teams:"KKR vs RR",result:"KKR won by 4 wkts",players:{
    // RR innings — 155/9
    "Yashasvi Jaiswal":   {bat:{runs:39,balls:29,fours:4,sixes:2,dismissed:true}},
    "Vaibhav Suryavanshi":{bat:{runs:46,balls:28,fours:6,sixes:2,dismissed:true}},
    "Dhruv Jurel":        {bat:{runs:5, balls:7, fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:1}},
    "Riyan Parag":        {bat:{runs:12,balls:14,fours:1,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:6,runs:10}},
    "Ravindra Jadeja":    {bat:{runs:9, balls:7, fours:1,sixes:0,dismissed:true},bowl:{wkts:2,lbwBold:0,maidens:0,dots:10,balls:18,runs:8}},
    "Jofra Archer":       {bat:{runs:8, balls:5, fours:1,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:9,balls:24,runs:35}},
    "Ravi Bishnoi":       {bat:{runs:0, balls:2, fours:0,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:24,runs:41}},
    "Nandre Burger":      {bowl:{wkts:1,lbwBold:0,maidens:0,dots:4,balls:12,runs:20}},
    // KKR innings — 161/6
    "Sunil Narine":       {bowl:{wkts:2,lbwBold:0,maidens:0,dots:13,balls:24,runs:26}},
    "Cameron Green":      {bat:{runs:27,balls:13,fours:4,sixes:1,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:12,runs:27},field:{catches:1,stumpings:0}},
  }},
  {id:"m29",num:29,date:"Apr 20",teams:"PBKS vs LSG",result:"PBKS won by 54 runs",players:{
    // PBKS innings — 254/7
    "Priyansh Arya":      {bat:{runs:93,balls:37,fours:4,sixes:9,dismissed:true}},
    "Prabsimran Singh":   {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Cooper Connolly":    {bat:{runs:87,balls:46,fours:8,sixes:7,dismissed:true}},
    "Shreyas Iyer":       {bat:{runs:5, balls:6, fours:0,sixes:0,dismissed:true}},
    "Marco Jansen":       {bat:{runs:1, balls:1, fours:0,sixes:0,dismissed:false},bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:24,runs:37}},
    "Arshdeep Singh":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:41}},
    // LSG innings — 200/5
    "Mitchell Marsh":     {bat:{runs:40,balls:28,fours:3,sixes:2,dismissed:true},field:{catches:2,stumpings:0}},
    "Nicholas Pooran":    {bat:{runs:9, balls:9, fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Aiden Markram":      {bat:{runs:42,balls:22,fours:3,sixes:3,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:0,balls:6,runs:32},field:{catches:1,stumpings:0}},
    "Mohammed Shami":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:56},field:{catches:1,stumpings:0}},
    "Prince Yadav":       {bowl:{wkts:2,lbwBold:0,maidens:0,dots:10,balls:24,runs:25}},
    "Avesh Khan":         {bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:18,runs:46}},
  }},
  {id:"m30",num:30,date:"Apr 21",teams:"GT vs MI",result:"MI won by 99 runs",players:{
    // MI innings — 199/5
    "Quinton de Kock":    {bat:{runs:13,balls:11,fours:1,sixes:1,dismissed:true},field:{catches:1,stumpings:1}},
    "Suryakumar Yadav":   {bat:{runs:15,balls:10,fours:1,sixes:1,dismissed:true}},
    "Hardik Pandya":      {bat:{runs:15,balls:16,fours:1,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:1,maidens:0,dots:2,balls:6,runs:18}},
    "Sherfane Rutherford":{bat:{runs:1, balls:2, fours:0,sixes:0,dismissed:false}},
    "Jasprit Bumrah":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:11,balls:18,runs:15}},
    // GT innings — 100 all out
    "Sai Sudarshan":      {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Shubman Gill":       {bat:{runs:14,balls:13,fours:3,sixes:0,dismissed:true}},
    "Jos Buttler":        {bat:{runs:5, balls:6, fours:1,sixes:0,dismissed:true}},
    "Rashid Khan":        {bat:{runs:4, balls:6, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:24,runs:31}},
    "Kagiso Rabada":      {bat:{runs:12,balls:14,fours:2,sixes:0,dismissed:true},bowl:{wkts:3,lbwBold:0,maidens:0,dots:10,balls:24,runs:33}},
    "Prasidh Krishna":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:4,balls:24,runs:54}},
    "Mohammed Siraj":     {bat:{runs:0, balls:3, fours:0,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:11,balls:24,runs:25}},
  }},
  {id:"m31",num:31,date:"Apr 22",teams:"SRH vs DC",result:"SRH won by 47 runs",players:{
    // SRH innings — 242/2
    "Abhishek Sharma":   {bat:{runs:135,balls:68,fours:10,sixes:10,dismissed:false},field:{catches:2,stumpings:0}},
    "Ishan Kishan":      {bat:{runs:25,balls:13,fours:2,sixes:1,dismissed:true}},
    "Heinrich Klaasen":  {bat:{runs:37,balls:13,fours:3,sixes:3,dismissed:false}},
    "Travis Head":       {bat:{runs:37,balls:26,fours:2,sixes:2,dismissed:true}},
    "Sakib Hussain":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:29},field:{catches:1,stumpings:0}},
    "Harsh Dubey":       {bowl:{wkts:3,lbwBold:0,maidens:0,dots:5,balls:12,runs:12}},
    // DC innings — 195/9
    "KL Rahul":          {bat:{runs:37,balls:23,fours:1,sixes:3,dismissed:true}},
    "Samir Rizvi":       {bat:{runs:41,balls:28,fours:2,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
    "Axar Patel":        {bat:{runs:2, balls:3, fours:0,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:1,balls:12,runs:23}},
    "Kuldeep Yadav":     {bat:{runs:1, balls:2, fours:0,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:2,balls:12,runs:30}},
  }},
  {id:"m32",num:32,date:"Apr 24",teams:"LSG vs RR",result:"RR won by 40 runs",players:{
    // RR innings — 159/6
    "Yashasvi Jaiswal":   {bat:{runs:22,balls:12,fours:4,sixes:0,dismissed:true}},
    "Vaibhav Suryavanshi":{bat:{runs:8, balls:11,fours:2,sixes:0,dismissed:true}},
    "Aiden Markram":      {bat:{runs:0, balls:6, fours:0,sixes:0,dismissed:true}},
    "Dhruv Jurel":        {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true},field:{catches:3,stumpings:0}},
    "Riyan Parag":        {bat:{runs:20,balls:19,fours:2,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Ravindra Jadeja":    {bat:{runs:43,balls:29,fours:2,sixes:1,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:9,balls:24,runs:29}},
    "Jofra Archer":       {bowl:{wkts:3,lbwBold:0,maidens:1,dots:17,balls:24,runs:20}},
    "Nandre Burger":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:15,balls:24,runs:27}},
    "Ravi Bishnoi":       {bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:18,runs:23}},
    // LSG innings — 119 all out
    "Mitchell Marsh":     {bat:{runs:55,balls:41,fours:6,sixes:2,dismissed:true}},
    "Nicholas Pooran":    {bat:{runs:22,balls:25,fours:3,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Mohammed Shami":     {bat:{runs:6, balls:4, fours:0,sixes:1,dismissed:true},bowl:{wkts:2,lbwBold:0,maidens:0,dots:15,balls:24,runs:30}},
    "Digvesh Rathi":      {bat:{runs:2, balls:2, fours:0,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:24,runs:26}},
    "Prince Yadav":       {bowl:{wkts:2,lbwBold:0,maidens:0,dots:13,balls:24,runs:29},field:{catches:1,stumpings:0}},
  }},
  {id:"m33",num:33,date:"Apr 24",teams:"CSK vs MI",result:"CSK won by 103 runs",players:{
    // CSK innings — 207/6
    "Sanju Samson":      {bat:{runs:101,balls:54,fours:10,sixes:6,dismissed:false},field:{catches:2,stumpings:0}},
    "Ruturaj Gaikwad":   {bat:{runs:22,balls:14,fours:3,sixes:1,dismissed:true}},
    "Sarfaraz Khan":     {bat:{runs:14,balls:8, fours:3,sixes:0,dismissed:true}},
    "Anshul Kamboj":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:12,balls:18,runs:10},field:{catches:1,stumpings:0}},
    "Noor Ahmed":        {bowl:{wkts:2,lbwBold:0,maidens:0,dots:10,balls:24,runs:23}},
    // MI innings — 104 all out
    "Quinton de Kock":   {bat:{runs:7, balls:10,fours:0,sixes:1,dismissed:true}},
    "Suryakumar Yadav":  {bat:{runs:35,balls:30,fours:5,sixes:0,dismissed:true}},
    "Hardik Pandya":     {bat:{runs:1, balls:2, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:12,runs:38}},
    "Sherfane Rutherford":{bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Jasprit Bumrah":    {bat:{runs:2, balls:5, fours:0,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:10,balls:24,runs:31},field:{catches:1,stumpings:0}},
  }},
  {id:"m34",num:34,date:"Apr 25",teams:"RCB vs GT",result:"RCB won by 5 wkts",players:{
    // GT innings — 205/3
    "Sai Sudarshan":     {bat:{runs:100,balls:58,fours:11,sixes:5,dismissed:true}},
    "Shubman Gill":      {bat:{runs:32,balls:24,fours:2,sixes:1,dismissed:true}},
    "Jos Buttler":       {bat:{runs:25,balls:16,fours:2,sixes:1,dismissed:true}},
    "Rashid Khan":       {bowl:{wkts:2,lbwBold:0,maidens:0,dots:7,balls:24,runs:49}},
    "Kagiso Rabada":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:45}},
    "Mohammed Siraj":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:9,balls:18,runs:25}},
    "Prasidh Krishna":   {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:12,runs:31}},
    // RCB innings — 206/5
    "Virat Kohli":       {bat:{runs:81,balls:44,fours:8,sixes:4,dismissed:true}},
    "Devdutt Padikkal":  {bat:{runs:55,balls:27,fours:2,sixes:6,dismissed:true},field:{catches:1,stumpings:0}},
    "Rajat Patidar":     {bat:{runs:8, balls:5, fours:0,sixes:1,dismissed:true}},
    "Tim David":         {bat:{runs:10,balls:9, fours:0,sixes:1,dismissed:false}},
    "Krunal Pandya":     {bat:{runs:23,balls:12,fours:3,sixes:1,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:24,runs:50}},
    "Josh Hazlewood":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:11,balls:24,runs:40},field:{catches:2,stumpings:0}},
    "Suyash Sharma":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:24,runs:36}},
  }},
  {id:"m35",num:35,date:"Apr 25",teams:"PBKS vs DC",result:"PBKS won by 6 wkts",players:{
    // DC innings — 264/2
    "KL Rahul":          {bat:{runs:152,balls:67,fours:16,sixes:9,dismissed:false}},
    "Axar Patel":        {bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:24,runs:44}},
    "Kuldeep Yadav":     {bowl:{wkts:2,lbwBold:1,maidens:0,dots:8,balls:24,runs:46}},
    "Samir Rizvi":       {field:{catches:1,stumpings:0}},
    // PBKS innings — 265/4
    "Priyansh Arya":     {bat:{runs:43,balls:17,fours:2,sixes:5,dismissed:true}},
    "Prabsimran Singh":  {bat:{runs:76,balls:26,fours:9,sixes:5,dismissed:true},field:{catches:1,stumpings:0}},
    "Cooper Connolly":   {bat:{runs:17,balls:10,fours:1,sixes:1,dismissed:true}},
    "Shreyas Iyer":      {bat:{runs:71,balls:36,fours:3,sixes:7,dismissed:false},field:{catches:1,stumpings:0}},
    "Marco Jansen":      {bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:45}},
    "Arshdeep Singh":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:3,balls:24,runs:49}},
  }},
  {id:"m36",num:36,date:"Apr 25",teams:"RR vs SRH",result:"SRH won by 5 wkts",players:{
    // RR innings — 228/6
    "Yashasvi Jaiswal":   {bat:{runs:10,balls:8, fours:2,sixes:0,dismissed:true}},
    "Vaibhav Suryavanshi":{bat:{runs:103,balls:37,fours:5,sixes:12,dismissed:true}},
    "Dhruv Jurel":        {bat:{runs:51,balls:35,fours:8,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Riyan Parag":        {bat:{runs:7, balls:9, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:0,balls:6,runs:12}},
    "Ravindra Jadeja":    {bat:{runs:4, balls:3, fours:1,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:2,balls:6,runs:11}},
    "Jofra Archer":       {bat:{runs:2, balls:2, fours:0,sixes:0,dismissed:false},bowl:{wkts:2,lbwBold:0,maidens:0,dots:13,balls:24,runs:34},field:{catches:1,stumpings:0}},
    "Nandre Burger":      {bowl:{wkts:0,lbwBold:0,maidens:0,dots:9,balls:21,runs:50}},
    "Ravi Bishnoi":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:6,runs:16},field:{catches:1,stumpings:0}},
    // SRH innings — 229/5
    "Abhishek Sharma":    {bat:{runs:57,balls:29,fours:11,sixes:1,dismissed:true}},
    "Ishan Kishan":       {bat:{runs:74,balls:31,fours:11,sixes:3,dismissed:true}},
    "Heinrich Klaasen":   {bat:{runs:29,balls:24,fours:3,sixes:1,dismissed:true},field:{catches:2,stumpings:0}},
    "Sakib Hussain":      {bowl:{wkts:1,lbwBold:1,maidens:0,dots:6,balls:24,runs:62}},
    "Praful Hinge":       {bowl:{wkts:1,lbwBold:0,maidens:0,dots:9,balls:24,runs:49}},
  }},
];

// IPL team mapping for W2 players — used for Watch Out section & validation
const PLAYER_IPL_TEAM_W2 = {
  // Madhu
  "Jos Buttler":"GT","Ishan Kishan":"SRH","Ruturaj Gaikwad":"CSK","Shubman Gill":"GT",
  "Priyansh Arya":"PBKS","Angkrish Raghuvanshi":"KKR","Travis Head":"SRH","Yashasvi Jaiswal":"RR",
  "Sunil Narine":"KKR","Axar Patel":"DC","Shivam Dube":"CSK","Jitesh Sharma":"RCB",
  "Ryan Rickelton":"MI","Rohit Sharma":"MI","Hardik Pandya":"MI",
  // Akshay
  "Jamie Overton":"CSK","Sai Sudarshan":"GT","Virat Kohli":"RCB","Devdutt Padikkal":"RCB",
  "Ajinkya Rahane":"KKR","Ayush Badoni":"LSG","Vaibhav Suryavanshi":"RR","Abhishek Sharma":"SRH",
  "Jacob Duffy":"RCB","Rashid Khan":"GT","Krunal Pandya":"RCB","Noor Ahmed":"CSK",
  "Prasidh Krishna":"GT","Heinrich Klaasen":"SRH","Shardul Thakur":"MI",
  // Sunil
  "Sanju Samson":"CSK","Prince Yadav":"LSG","Phil Salt":"RCB","Ayush Mhatre":"CSK",
  "Anshul Kamboj":"CSK","Rajat Patidar":"RCB","Finn Allen":"KKR","Harsh Dubey":"SRH",
  "Digvesh Rathi":"LSG","Marco Jansen":"PBKS","Jasprit Bumrah":"MI","Suryakumar Yadav":"MI",
  "Tilak Varma":"MI","Mitchell Santner":"MI","Kagiso Rabada":"GT",
  // Yogesh
  "Dhruv Jurel":"RR","Tim David":"RCB","Mohammed Shami":"LSG","Samir Rizvi":"DC",
  "Mohammed Siraj":"GT","Ravi Bishnoi":"RR","Sarfaraz Khan":"CSK","Bhuvneshwar Kumar":"RCB",
  "Cameron Green":"KKR","Josh Hazlewood":"RCB","Deepak Chahar":"MI","Pathum Nissanka":"DC",
  "Rishabh Pant":"LSG","Suyash Sharma":"RCB","David Miller":"DC",
};

const RAW_W2 = [
  {id:"m19",num:19,date:"Apr 12",teams:"LSG vs GT",result:"GT won by 7 wkts",players:{
    // LSG innings
    "Mitchell Marsh":    {bat:{runs:11,balls:4, fours:1,sixes:1,dismissed:true}},
    "Aiden Markram":     {bat:{runs:30,balls:21,fours:5,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Rishabh Pant":      {bat:{runs:18,balls:11,fours:2,sixes:1,dismissed:true},field:{catches:0,stumpings:1}},
    "Ayush Badoni":      {bat:{runs:9, balls:11,fours:1,sixes:0,dismissed:true}},
    "Nicholas Pooran":   {bat:{runs:19,balls:21,fours:0,sixes:2,dismissed:true}},
    "Abdul Samad":       {bat:{runs:18,balls:22,fours:2,sixes:0,dismissed:true}},
    "Mukul Choudhary":   {bat:{runs:18,balls:14,fours:1,sixes:1,dismissed:true}},
    "George Linde":      {bat:{runs:16,balls:10,fours:3,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:5,balls:18,runs:28}},
    "Mohammed Shami":    {bat:{runs:12,balls:5, fours:1,sixes:1,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:12,balls:24,runs:36}},
    "Avesh Khan":        {bat:{runs:4, balls:1, fours:1,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:12,runs:24},field:{catches:1,stumpings:0}},
    "Digvesh Rathi":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:6,balls:24,runs:31}},
    "Prince Yadav":      {bowl:{wkts:1,lbwBold:0,maidens:0,dots:9,balls:24,runs:31}},
    // GT innings
    "Sai Sudarshan":     {bat:{runs:15,balls:14,fours:3,sixes:0,dismissed:true}},
    "Shubman Gill":      {bat:{runs:56,balls:40,fours:6,sixes:1,dismissed:true},field:{catches:2,stumpings:0}},
    "Jos Buttler":       {bat:{runs:60,balls:37,fours:11,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Washington Sundar": {bat:{runs:21,balls:13,fours:2,sixes:1,dismissed:false},field:{catches:1,stumpings:0}},
    "Rahul Tewatia":     {bat:{runs:10,balls:8, fours:1,sixes:0,dismissed:false},field:{catches:1,stumpings:0}},
    "Glenn Phillips":    {field:{catches:2,stumpings:0}},
    "Rashid Khan":       {bowl:{wkts:0,lbwBold:0,maidens:0,dots:9,balls:24,runs:25}},
    "Kagiso Rabada":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:24,runs:54}},
    "Mohammed Siraj":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:13,balls:24,runs:19}},
    "Prasidh Krishna":   {bowl:{wkts:4,lbwBold:0,maidens:0,dots:13,balls:24,runs:28}},
    "Ashok Sharma":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:14,balls:24,runs:32}},
  }},
  {id:"m20",num:20,date:"Apr 12",teams:"MI vs RCB",result:"RCB won by 18 runs",players:{
    // RCB innings
    "Phil Salt":         {bat:{runs:78,balls:36,fours:6,sixes:6,dismissed:true}},
    "Virat Kohli":       {bat:{runs:50,balls:38,fours:5,sixes:1,dismissed:true}},
    "Rajat Patidar":     {bat:{runs:53,balls:20,fours:4,sixes:5,dismissed:true}},
    "Tim David":         {bat:{runs:34,balls:16,fours:2,sixes:3,dismissed:false}},
    "Jitesh Sharma":     {bat:{runs:10,balls:9,fours:1,sixes:0,dismissed:true}},
    "Romario Shepherd":  {bat:{runs:2,balls:2,fours:0,sixes:0,dismissed:false},field:{catches:1,stumpings:0}},
    "Trent Boult":       {bowl:{wkts:1,lbwBold:1,maidens:0,dots:5,balls:24,runs:50}},
    "Hardik Pandya":     {bat:{runs:40,balls:22,fours:6,sixes:1,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:24,runs:39},field:{catches:1,stumpings:0}},
    "Jasprit Bumrah":    {bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:35}},
    "Mitchell Santner":  {bat:{runs:8,balls:6,fours:1,sixes:0,dismissed:false},bowl:{wkts:1,lbwBold:0,maidens:0,dots:9,balls:24,runs:43},field:{catches:1,stumpings:0}},
    "Mayank Markande":   {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:12,runs:40}},
    "Shardul Thakur":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:3,balls:12,runs:32}},
    "Suryakumar Yadav":  {bat:{runs:33,balls:22,fours:5,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    // MI innings
    "Ryan Rickelton":    {bat:{runs:37,balls:22,fours:3,sixes:3,dismissed:true}},
    "Rohit Sharma":      {bat:{runs:19,balls:13,fours:2,sixes:1,dismissed:false}},
    "Tilak Varma":       {bat:{runs:1,balls:3,fours:0,sixes:0,dismissed:true}},
    "Sherfane Rutherford":{bat:{runs:71,balls:31,fours:1,sixes:9,dismissed:false}},
    "Naman Dhir":        {bat:{runs:1,balls:2,fours:0,sixes:0,dismissed:true}},
    "Jacob Duffy":       {bowl:{wkts:1,lbwBold:0,maidens:0,dots:10,balls:24,runs:58},field:{catches:1,stumpings:0}},
    "Bhuvneshwar Kumar": {bowl:{wkts:0,lbwBold:0,maidens:0,dots:6,balls:24,runs:38},field:{catches:1,stumpings:0}},
    "Rasikh Dar":        {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:17,runs:23},field:{catches:1,stumpings:0}},
    "Krunal Pandya":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:7,balls:24,runs:26}},
    "Suyash Sharma":     {bowl:{wkts:2,lbwBold:0,maidens:0,dots:6,balls:24,runs:47}},
    "Rajat Patidar":     {bat:{runs:53,balls:20,fours:4,sixes:5,dismissed:true},field:{catches:1,stumpings:0}},
    "Devdutt Padikkal":  {},
  }},
  {id:"m21",num:21,date:"Apr 13",teams:"SRH vs RR",result:"SRH won by 57 runs",players:{
    // SRH innings — 216/6
    "Abhishek Sharma":   {bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Travis Head":       {bat:{runs:18,balls:18,fours:3,sixes:0,dismissed:true}},
    "Ishan Kishan":      {bat:{runs:91,balls:44,fours:8,sixes:6,dismissed:true},field:{catches:2,stumpings:0}},
    "Heinrich Klaasen":  {bat:{runs:40,balls:26,fours:1,sixes:3,dismissed:true}},
    "Nitish Kumar Reddy":{bat:{runs:28,balls:13,fours:0,sixes:4,dismissed:true}},
    "Aniket Verma":      {bat:{runs:6,balls:5,fours:1,sixes:0,dismissed:true}},
    "Harsh Dubey":       {bat:{runs:0,balls:0,fours:0,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:12,runs:22}},
    "Jofra Archer":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:13,balls:24,runs:37}},
    "Ravi Bishnoi":      {bowl:{wkts:0,lbwBold:0,maidens:0,dots:1,balls:18,runs:35},field:{catches:1,stumpings:0}},
    // RR innings — 159 all out
    "Yashasvi Jaiswal":  {bat:{runs:1,balls:5,fours:0,sixes:0,dismissed:true}},
    "Vaibhav Suryavanshi":{bat:{runs:0,balls:1,fours:0,sixes:0,dismissed:true}},
    "Dhruv Jurel":       {bat:{runs:0,balls:2,fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
  }},
  {id:"m22",num:22,date:"Apr 14",teams:"CSK vs KKR",result:"CSK won by 32 runs",players:{
    // CSK innings — 192/5
    "Sanju Samson":        {bat:{runs:48,balls:32,fours:4,sixes:3,dismissed:true}},
    "Ruturaj Gaikwad":     {bat:{runs:7, balls:6, fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Ayush Mhatre":        {bat:{runs:38,balls:17,fours:6,sixes:2,dismissed:true}},
    "Sarfaraz Khan":       {bat:{runs:23,balls:18,fours:1,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
    "Shivam Dube":         {bat:{runs:13,balls:12,fours:1,sixes:0,dismissed:false},field:{catches:2,stumpings:0}},
    "Jamie Overton":       {bat:{runs:7, balls:6, fours:1,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:6,balls:18,runs:32}},
    "Noor Ahmed":          {bowl:{wkts:3,lbwBold:1,maidens:0,dots:8,balls:24,runs:21}},
    "Anshul Kamboj":       {bowl:{wkts:2,lbwBold:0,maidens:0,dots:9,balls:24,runs:32}},
    // KKR innings — 160/7
    "Finn Allen":          {bat:{runs:1, balls:3, fours:0,sixes:0,dismissed:true}},
    "Sunil Narine":        {bat:{runs:24,balls:17,fours:2,sixes:2,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:11,balls:24,runs:21}},
    "Ajinkya Rahane":      {bat:{runs:28,balls:22,fours:0,sixes:2,dismissed:true}},
    "Angkrish Raghuvanshi":{bat:{runs:27,balls:19,fours:3,sixes:1,dismissed:true}},
    "Cameron Green":       {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:12,runs:30}},
  }},
  {id:"m23",num:23,date:"Apr 15",teams:"RCB vs LSG",result:"RCB won by 5 wkts",players:{
    // LSG innings — 146 all out
    "Rishabh Pant":      {bat:{runs:1, balls:6, fours:0,sixes:0,dismissed:true}},
    "Ayush Badoni":      {bat:{runs:38,balls:24,fours:4,sixes:1,dismissed:true}},
    "Mohammed Shami":    {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:18,runs:30}},
    "Digvesh Rathi":     {bat:{runs:0, balls:3, fours:0,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:4,balls:24,runs:51},field:{catches:1,stumpings:0}},
    "Prince Yadav":      {bowl:{wkts:3,lbwBold:0,maidens:0,dots:8,balls:18,runs:32}},
    // RCB innings — 149/5 in 15.1 overs
    "Virat Kohli":       {bat:{runs:49,balls:34,fours:6,sixes:1,dismissed:true}},
    "Devdutt Padikkal":  {bat:{runs:10,balls:11,fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Rajat Patidar":     {bat:{runs:27,balls:13,fours:1,sixes:3,dismissed:true},field:{catches:1,stumpings:0}},
    "Jitesh Sharma":     {bat:{runs:23,balls:9, fours:2,sixes:2,dismissed:true},field:{catches:1,stumpings:0}},
    "Tim David":         {bat:{runs:14,balls:8, fours:1,sixes:1,dismissed:false},field:{catches:1,stumpings:0}},
    "Phil Salt":         {bat:{runs:7, balls:8, fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Krunal Pandya":     {bowl:{wkts:2,lbwBold:1,maidens:0,dots:10,balls:24,runs:38}},
    "Bhuvneshwar Kumar": {bowl:{wkts:3,lbwBold:1,maidens:0,dots:8,balls:24,runs:27}},
    "Josh Hazlewood":    {bowl:{wkts:1,lbwBold:1,maidens:0,dots:13,balls:24,runs:20}},
    "Suyash Sharma":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:34}},
  }},
  {id:"m24",num:24,date:"Apr 17",teams:"MI vs PBKS",result:"PBKS won by 7 wkts",players:{
    // MI innings — 195/6
    "Ryan Rickelton":    {bat:{runs:2, balls:8, fours:0,sixes:0,dismissed:true}},
    "Suryakumar Yadav":  {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Hardik Pandya":     {bat:{runs:14,balls:12,fours:0,sixes:1,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:18,runs:39}},
    "Tilak Varma":       {bat:{runs:8, balls:3, fours:2,sixes:0,dismissed:true}},
    "Shardul Thakur":    {bowl:{wkts:1,lbwBold:0,maidens:0,dots:2,balls:18,runs:42}},
    "Deepak Chahar":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:2,balls:15,runs:45},field:{catches:1,stumpings:0}},
    "Jasprit Bumrah":    {bowl:{wkts:0,lbwBold:0,maidens:0,dots:9,balls:24,runs:41}},
    // PBKS innings — 198/3
    "Priyansh Arya":     {bat:{runs:15,balls:9, fours:2,sixes:1,dismissed:true}},
    "Marco Jansen":      {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:30}},
  }},
  {id:"m25",num:25,date:"Apr 17",teams:"GT vs KKR",result:"GT won by 5 wkts",players:{
    // KKR innings — 180 all out
    "Ajinkya Rahane":      {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Angkrish Raghuvanshi":{bat:{runs:8, balls:4, fours:2,sixes:0,dismissed:true}},
    "Cameron Green":       {bat:{runs:79,balls:55,fours:7,sixes:4,dismissed:true},field:{catches:2,stumpings:0}},
    "Sunil Narine":        {bat:{runs:0, balls:5, fours:0,sixes:0,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:11,balls:24,runs:28}},
    // GT innings — 181/5
    "Shubman Gill":        {bat:{runs:86,balls:50,fours:8,sixes:4,dismissed:true}},
    "Jos Buttler":         {bat:{runs:25,balls:15,fours:2,sixes:2,dismissed:true},field:{catches:4,stumpings:0}},
    "Sai Sudarshan":       {bat:{runs:22,balls:16,fours:1,sixes:2,dismissed:true}},
    "Kagiso Rabada":       {bowl:{wkts:3,lbwBold:0,maidens:0,dots:13,balls:24,runs:29}},
    "Mohammed Siraj":      {bowl:{wkts:2,lbwBold:0,maidens:0,dots:14,balls:24,runs:23},field:{catches:1,stumpings:0}},
    "Prasidh Krishna":     {bowl:{wkts:1,lbwBold:0,maidens:0,dots:8,balls:24,runs:32}},
    "Rashid Khan":         {bowl:{wkts:1,lbwBold:0,maidens:0,dots:10,balls:24,runs:44}},
    "Glenn Phillips":      {field:{catches:2,stumpings:0}},
  }},
  {id:"m26",num:26,date:"Apr 19",teams:"RCB vs DC",result:"DC won by 6 wkts",players:{
    // RCB innings — 175/8
    "Phil Salt":         {bat:{runs:63,balls:38,fours:4,sixes:3,dismissed:true},field:{catches:1,stumpings:0}},
    "Virat Kohli":       {bat:{runs:19,balls:13,fours:3,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Devdutt Padikkal":  {bat:{runs:18,balls:13,fours:1,sixes:1,dismissed:true}},
    "Rajat Patidar":     {bat:{runs:8, balls:4, fours:0,sixes:1,dismissed:true}},
    "Tim David":         {bat:{runs:26,balls:17,fours:3,sixes:1,dismissed:true}},
    "Jitesh Sharma":     {bat:{runs:14,balls:20,fours:1,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Krunal Pandya":     {bat:{runs:12,balls:10,fours:0,sixes:1,dismissed:true},bowl:{wkts:1,lbwBold:0,maidens:0,dots:5,balls:24,runs:24}},
    "Bhuvneshwar Kumar": {bat:{runs:3, balls:2, fours:0,sixes:0,dismissed:false},bowl:{wkts:3,lbwBold:1,maidens:0,dots:8,balls:24,runs:26}},
    "Suyash Sharma":     {bowl:{wkts:0,lbwBold:0,maidens:0,dots:3,balls:18,runs:31}},
    "Josh Hazlewood":    {bowl:{wkts:0,lbwBold:0,maidens:0,dots:8,balls:24,runs:38}},
    // DC innings — 179/4
    "Pathum Nissanka":   {bat:{runs:1, balls:2, fours:0,sixes:0,dismissed:true},field:{catches:1,stumpings:0}},
    "Samir Rizvi":       {bat:{runs:2, balls:3, fours:0,sixes:0,dismissed:true}},
    "Axar Patel":        {bat:{runs:26,balls:19,fours:3,sixes:0,dismissed:false},bowl:{wkts:2,lbwBold:0,maidens:0,dots:7,balls:18,runs:18}},
    "David Miller":      {bat:{runs:22,balls:10,fours:1,sixes:2,dismissed:false},field:{catches:2,stumpings:0}},
  }},
  {id:"m27",num:27,date:"Apr 19",teams:"SRH vs CSK",result:"SRH won by 10 runs",players:{
    // SRH innings — 194/9
    "Abhishek Sharma":   {bat:{runs:59,balls:22,fours:6,sixes:4,dismissed:true},bowl:{wkts:0,lbwBold:0,maidens:0,dots:0,balls:6,runs:13}},
    "Travis Head":       {bat:{runs:23,balls:20,fours:3,sixes:1,dismissed:true}},
    "Ishan Kishan":      {bat:{runs:0, balls:1, fours:0,sixes:0,dismissed:true}},
    "Heinrich Klaasen":  {bat:{runs:59,balls:39,fours:6,sixes:2,dismissed:true}},
    // CSK innings — 184/8
    "Sanju Samson":      {bat:{runs:7, balls:3, fours:0,sixes:1,dismissed:true},field:{catches:1,stumpings:0}},
    "Ruturaj Gaikwad":   {bat:{runs:19,balls:13,fours:3,sixes:0,dismissed:true},field:{catches:2,stumpings:0}},
    "Ayush Mhatre":      {bat:{runs:30,balls:13,fours:5,sixes:1,dismissed:true}},
    "Sarfaraz Khan":     {bat:{runs:25,balls:19,fours:3,sixes:0,dismissed:true}},
    "Shivam Dube":       {bat:{runs:21,balls:16,fours:1,sixes:1,dismissed:true}},
    "Jamie Overton":     {bat:{runs:16,balls:15,fours:1,sixes:0,dismissed:true},bowl:{wkts:3,lbwBold:0,maidens:0,dots:5,balls:24,runs:37}},
    "Anshul Kamboj":     {bat:{runs:13,balls:8, fours:0,sixes:1,dismissed:false},bowl:{wkts:3,lbwBold:0,maidens:0,dots:10,balls:18,runs:22}},
    "Noor Ahmed":        {bat:{runs:1, balls:1, fours:0,sixes:0,dismissed:false},bowl:{wkts:0,lbwBold:0,maidens:0,dots:7,balls:24,runs:33},field:{catches:1,stumpings:0}},
  }},
];

function processWeek(raw, teams) {
  return raw.map(m => {
    const calc = {};
    for (const [owner, roster] of Object.entries(teams)) {
      const pList = roster.map(name => {
        const d = m.players[name];
        if (!d) return {name,played:false,total:0,bd:[]};
        const bat=calcBat(d.bat), bowl=calcBowl(d.bowl), field=calcField(d.field);
        const total=bat.pts+bowl.pts+field.pts;
        return {name,played:true,total,bd:[...bat.bd,...bowl.bd,...field.bd]};
      });
      calc[owner]={pts:pList.reduce((s,p)=>s+p.total,0),players:pList};
    }
    return {...m,calc};
  });
}

// Week 2 bowling calc — dots included (from screenshot 0s column)
function calcBowlW2(b) {
  if (!b) return {pts:0,bd:[]};
  let pts=0; const bd=[];
  const {wkts=0,lbwBold=0,maidens=0,dots=0,balls=0,runs=0}=b;
  if(wkts>0){pts+=wkts*25;bd.push(`${wkts}w(+${wkts*25})`);}
  if(lbwBold>0){pts+=lbwBold*8;bd.push(`${lbwBold}LBW/B(+${lbwBold*8})`);}
  if(wkts>=5){pts+=16;bd.push("5fer(+16)");}else if(wkts>=4){pts+=8;bd.push("4fer(+8)");}else if(wkts>=3){pts+=4;bd.push("3fer(+4)");}
  if(maidens>0){pts+=maidens*12;bd.push(`${maidens}mdn(+${maidens*12})`);}
  if(dots>0){pts+=dots;bd.push(`${dots}dots(+${dots})`);}
  const ov=balls/6;
  if(ov>=2&&balls>0){const eco=runs/ov; if(eco<5){pts+=6;bd.push(`Eco${eco.toFixed(1)}(+6)`);}else if(eco<=7){pts+=4;bd.push(`Eco${eco.toFixed(1)}(+4)`);}}
  return {pts,bd};
}

function processWeekW2(raw, teams) {
  return raw.map(m => {
    const calc = {};
    for (const [owner, roster] of Object.entries(teams)) {
      const pList = roster.map(name => {
        const d = m.players[name];
        if (!d) return {name,played:false,total:0,bd:[]};
        const bat=calcBat(d.bat), bowl=calcBowlW2(d.bowl), field=calcField(d.field);
        const total=bat.pts+bowl.pts+field.pts;
        return {name,played:true,total,bd:[...bat.bd,...bowl.bd,...field.bd]};
      });
      calc[owner]={pts:pList.reduce((s,p)=>s+p.total,0),players:pList};
    }
    return {...m,calc};
  });
}

const MATCHES = processWeek(RAW, TEAMS);
const MATCHES_W2 = processWeekW2(RAW_W2, TEAMS_W2);
const MATCHES_W3 = processWeekW2(RAW_W3, TEAMS_W3);
const MATCHES_W4 = processWeekW2(RAW_W4, TEAMS_W4);
const COLORS = {Madhu:"#f59e0b",Akshay:"#10b981",Sunil:"#ec4899",Yogesh:"#8b5cf6"};
const COLORS_BG = {Madhu:"#fef3c7",Akshay:"#d1fae5",Sunil:"#fce7f3",Yogesh:"#ede9fe"};
const RANK_MEDALS = ["🥇","🥈","🥉","4️⃣"];

const cs = {
  wrap: {fontFamily:"var(--font-sans)",color:"var(--color-text-primary)",paddingBottom:"2rem"},
  hdr: {
    background:"linear-gradient(135deg,#1e3a5f 0%,#0f2240 60%,#1a1040 100%)",
    borderRadius:"var(--border-radius-lg)",
    padding:"20px 24px",
    marginBottom:20,
    display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,
  },
  hdrTitle: {fontSize:22,fontWeight:700,color:"#fff",letterSpacing:"-0.3px",lineHeight:1.2},
  hdrSub:   {fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4},
  hdrBadge: {
    background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",
    borderRadius:20,padding:"5px 12px",fontSize:12,color:"rgba(255,255,255,0.85)",
    display:"flex",alignItems:"center",gap:6,
  },
  tabs: {
    display:"block",
    background:"#0f2240",
    padding:"6px 6px 4px 6px",borderRadius:10,
    width:"100%",marginBottom:20,
    boxShadow:"0 2px 8px rgba(15,34,64,0.15)",
  },
  tab: a=>({
    padding:"8px 16px",borderRadius:8,border:"none",
    background: a?"linear-gradient(135deg,#f59e0b,#f97316)":"transparent",
    color: a?"#fff":"rgba(255,255,255,0.55)",
    cursor:"pointer",fontSize:13,fontWeight: a?600:400,
    fontFamily:"var(--font-sans)",
    boxShadow: a?"0 2px 6px rgba(245,158,11,0.4)":"none",
    transition:"all 0.15s",
  }),
  card: {
    background:"var(--color-background-primary)",
    border:"1px solid var(--color-border-tertiary)",
    borderRadius:"var(--border-radius-lg)",padding:"16px 20px",
    boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
  },
  g4: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginBottom:24},
  row: {
    display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,
    padding:"12px 16px",
    background:"var(--color-background-primary)",
    border:"1px solid var(--color-border-tertiary)",
    borderRadius:"var(--border-radius-md)",cursor:"pointer",marginBottom:6,
    boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
    transition:"box-shadow 0.15s,border-color 0.15s",
  },
  btn: {
    padding:"7px 16px",borderRadius:"var(--border-radius-md)",
    border:"1px solid #1e3a5f",
    background:"#1e3a5f",color:"#fff",
    cursor:"pointer",fontSize:13,fontWeight:500,
    fontFamily:"var(--font-sans)",
    boxShadow:"0 1px 3px rgba(0,0,0,0.1)",
  },
  sec: {
    fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",
    color:"#1e3a5f",marginBottom:10,
    display:"flex",alignItems:"center",gap:6,
  },
  sectionBar: {
    height:3,width:24,background:"linear-gradient(90deg,#f59e0b,#f97316)",
    borderRadius:2,display:"inline-block",marginRight:6,verticalAlign:"middle",
  },
};
const pSt = v=>({color:v>0?"#059669":v<0?"#dc2626":"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",fontSize:13,fontWeight:v!==0?600:400});
const pStr = v=>(v>0?"+":"")+v;

const IPL_COLORS = {
  CSK:{bg:"#f5a623",fg:"#1a1a2e"},MI:{bg:"#004BA0",fg:"#fff"},
  RCB:{bg:"#c8102e",fg:"#fff"},KKR:{bg:"#3a225d",fg:"#f5a623"},
  GT:{bg:"#1C4399",fg:"#C8A951"},SRH:{bg:"#f26522",fg:"#1a1a2e"},
  RR:{bg:"#254aa5",fg:"#ff69b4"},PBKS:{bg:"#aa4545",fg:"#fff"},
  DC:{bg:"#0078bc",fg:"#ef1b23"},LSG:{bg:"#00adef",fg:"#fff"},
};

export default function App() {
  const [view,setView]=useState("leaderboard");
  const [selM,setSM]=useState(null);
  const [selO,setSO]=useState(null);

  const totals=Object.keys(TEAMS).reduce((a,o)=>{
    const w1=MATCHES.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);
    const w2=MATCHES_W2.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);
    const w3=MATCHES_W3.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);
    const w4=MATCHES_W4.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);
    a[o]=w1+w2+w3+w4; return a;
  },{});
  const totalsW1=Object.keys(TEAMS).reduce((a,o)=>{a[o]=MATCHES.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);return a},{});
  const totalsW2=Object.keys(TEAMS_W2).reduce((a,o)=>{a[o]=MATCHES_W2.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);return a},{});
  const totalsW3=Object.keys(TEAMS_W3).reduce((a,o)=>{a[o]=MATCHES_W3.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);return a},{});
  const totalsW4=Object.keys(TEAMS_W4).reduce((a,o)=>{a[o]=MATCHES_W4.reduce((s,m)=>s+(m.calc[o]?.pts||0),0);return a},{});
  const ranked=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  const maxPts=ranked[0]?.[1]||1;

  return (
    <div style={cs.wrap}>
      {/* ── HEADER ── */}
      <div style={cs.hdr}>
        <div>
          <div style={cs.hdrTitle}>🏏 IPL Owner League 2026</div>
          <div style={cs.hdrSub}>Season running · W1, W2 & W3 complete · Week 4 underway</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        </div>
      </div>

      {view!=="match"&&view!=="owner"&&(
        <div style={cs.tabs}>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
          {/* Row 1 — Main navigation */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button style={cs.tab(view==="leaderboard")} onClick={()=>setView("leaderboard")}>Leaderboard</button>
            <button style={cs.tab(view==="universe")} onClick={()=>setView("universe")}>Player Universe</button>
            <button style={cs.tab(view==="scoring")} onClick={()=>setView("scoring")}>Scoring Guide</button>
          </div>
          {/* Row 2 — Weekly tabs */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button style={cs.tab(view==="week1")} onClick={()=>setView("week1")}>Week 1</button>
            <button style={cs.tab(view==="week2")} onClick={()=>setView("week2")}>Week 2</button>
            <button style={cs.tab(view==="week3")} onClick={()=>setView("week3")}>Week 3</button>
            <button style={cs.tab(view==="week4")} onClick={()=>setView("week4")}>Week 4</button>
          </div>
        </div>
        </div>
      )}

      {view==="leaderboard"&&<>
        {/* ── BREAKING NEWS ── */}
        {(()=>{
          const [first,fpts]=ranked[0]||[];
          const [second,spts]=ranked[1]||[];
          const [third]=ranked[2]||[];
          const gap=fpts-spts;
          return (
            <div style={{
              background:"linear-gradient(135deg,#7c0a02,#b91c1c,#dc2626,#f97316)",
              backgroundSize:"300% 300%",
              borderRadius:"var(--border-radius-lg)",
              padding:"14px 20px",
              marginBottom:16,
              display:"flex",alignItems:"center",gap:14,
              boxShadow:"0 4px 24px rgba(220,38,38,0.4)",
              animation:"pulse 2s infinite",
              position:"relative",overflow:"hidden",
            }}>
              <div style={{
                position:"absolute",inset:0,
                background:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px)",
              }}/>
              <div style={{fontSize:28,flexShrink:0,zIndex:1}}>🚨</div>
              <div style={{zIndex:1,flex:1}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:"2px",color:"#fde68a",textTransform:"uppercase",marginBottom:3}}>
                  ⚡ Breaking · Post M42
                </div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",lineHeight:1.4,marginBottom:4}}>
                  🏆 Akshay first to 5000! Not just lucky picks — this is pure auction mastery. The gap is a chasm now 👑
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.85)",fontWeight:500}}>
                  📊 Madhu W4 on fire but Akshay keeps pulling away · Sunil's Rashid Khan 107pts today · Yogesh searching for answers 🔍
                </div>
              </div>
              <div style={{
                flexShrink:0,zIndex:1,
                background:"rgba(0,0,0,0.3)",
                borderRadius:10,padding:"6px 12px",
                textAlign:"center",
              }}>
                <div style={{fontSize:10,color:"#fde68a",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase"}}>Leader</div>
                <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:"var(--font-mono)"}}>{fpts}</div>
                <div style={{fontSize:11,color:"#fde68a",fontWeight:600}}>{first}</div>
              </div>
              <style>{`@keyframes pulse{0%,100%{box-shadow:0 4px 24px rgba(220,38,38,0.4)}50%{box-shadow:0 4px 32px rgba(249,115,22,0.7)}}`}</style>
            </div>
          );
        })()}

        {/* ── M43 WATCHOUT ── */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:13}}>👀</span>
            <span style={{fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",color:"#1e3a5f"}}>Watch Out For · M43 · RR vs DC · Sunil loaded! 🎯</span>
          </div>
          <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"12px 14px",border:"1px solid var(--color-border-tertiary)"}}>
            {[
              {owner:"Madhu",  players:"Jaiswal, Parag (RR) · Axar Patel (DC)"},
              {owner:"Akshay", players:"Vaibhav Suryavanshi, Jurel (RR) · KL Rahul (DC)"},
              {owner:"Sunil",  players:"Archer, Burger (RR) · Nitish Rana, Rizvi, Kuldeep (DC)"},
              {owner:"Yogesh", players:"Ravi Bishnoi (RR) · no DC 😶"},
            ].map(({owner,players},i,arr)=>(
              <div key={owner} style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:i<arr.length-1?7:0,paddingBottom:i<arr.length-1?7:0,borderBottom:i<arr.length-1?"0.5px solid var(--color-border-tertiary)":"none"}}>
                <span style={{fontSize:12,fontWeight:800,color:COLORS[owner],minWidth:52,flexShrink:0}}>{owner}</span>
                <span style={{fontSize:12,color:"var(--color-text-primary)",lineHeight:1.4}}>{players}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={cs.g4}>
          {ranked.map(([owner,pts],i)=>{
            const w1pts=totalsW1[owner]||0;
            const w2pts=totalsW2[owner]||0;
            const w3pts=totalsW3[owner]||0;
            const w4pts=totalsW4[owner]||0;
            const totalApps=MATCHES.reduce((s,m)=>(m.calc[owner]?.players||[]).filter(p=>p.played).length+s,0)
                           +MATCHES_W2.reduce((s,m)=>(m.calc[owner]?.players||[]).filter(p=>p.played).length+s,0)
                           +MATCHES_W3.reduce((s,m)=>(m.calc[owner]?.players||[]).filter(p=>p.played).length+s,0)
                           +MATCHES_W4.reduce((s,m)=>(m.calc[owner]?.players||[]).filter(p=>p.played).length+s,0);
            // Form chart — last 5 matches across W1+W2
            const allMatchPts=[...MATCHES,...MATCHES_W2,...MATCHES_W3,...MATCHES_W4].map(m=>m.calc[owner]?.pts||0);
            const last5=allMatchPts.slice(-5);
            const maxBar=Math.max(...last5,1);
            return (
              <div key={owner} style={{
                ...cs.card,
                borderTop:`4px solid ${COLORS[owner]}`,
                cursor:"pointer",
                background: i===0 ? `linear-gradient(135deg,${COLORS_BG[owner]},#fff)` : "var(--color-background-primary)",
              }} onClick={()=>{setSO(owner);setView("owner");}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontSize:22}}>{RANK_MEDALS[i]}</span>
                  <span style={{fontSize:11,background:COLORS[owner],color:"#fff",padding:"2px 8px",borderRadius:10,fontWeight:600}}>{i===0?"LEADER":"#"+(i+1)}</span>
                </div>
                <div style={{fontSize:17,fontWeight:700,color:COLORS[owner],marginBottom:4}}>{owner}</div>
                <div style={{fontSize:34,fontWeight:700,fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",lineHeight:1,marginBottom:6}}>{pts}</div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <span style={{fontSize:11,color:"var(--color-text-secondary)",background:"var(--color-background-secondary)",padding:"2px 7px",borderRadius:4}}>W1: {w1pts}</span>
                  <span style={{fontSize:11,color:"var(--color-text-secondary)",background:"var(--color-background-secondary)",padding:"2px 7px",borderRadius:4}}>W2: {w2pts}</span>
                  <span style={{fontSize:11,color:"var(--color-text-secondary)",background:"var(--color-background-secondary)",padding:"2px 7px",borderRadius:4}}>W3: {w3pts}</span>
                  <span style={{fontSize:11,color:"var(--color-text-secondary)",background:"var(--color-background-secondary)",padding:"2px 7px",borderRadius:4}}>W4: {w4pts}</span>
                </div>
                {/* Form chart */}
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--color-text-tertiary)",marginBottom:4}}>Form · last {last5.length} matches</div>
                  <div style={{display:"flex",alignItems:"flex-end",gap:3,height:28}}>
                    {last5.map((v,j)=>(
                      <div key={j} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <div style={{width:"100%",height:`${Math.max(Math.round(v/maxBar*24),2)}px`,background:`${COLORS[owner]}${v===maxBar?"ff":"99"}`,borderRadius:"2px 2px 0 0",transition:"height 0.3s"}}/>
                        <div style={{fontSize:8,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",lineHeight:1}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{height:4,background:"var(--color-border-tertiary)",borderRadius:3}}>
                  <div style={{height:4,width:`${Math.round(pts/maxPts*100)}%`,background:`linear-gradient(90deg,${COLORS[owner]},${COLORS[owner]}cc)`,borderRadius:3}}/>
                </div>
              </div>
            );
          })}
        </div>

        {MATCHES_W4.length>0&&<>
          <div style={cs.sec}><span style={cs.sectionBar}/>Week 4 · M37+</div>
          {[...MATCHES_W4].reverse().map(m=>(
            <div key={m.id} style={{...cs.row,cursor:"pointer"}} onClick={()=>{setSM(m.id);setView("match");}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:11,color:"#fff",background:"#7c3aed",padding:"3px 8px",borderRadius:5,fontFamily:"var(--font-mono)",fontWeight:600}}>M{m.num}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600}}>{m.teams}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{m.date} · {m.result}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:14}}>
                {Object.keys(TEAMS_W4).map(o=>(
                  <div key={o} style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>{o}</div>
                    <div style={{fontSize:15,fontWeight:700,fontFamily:"var(--font-mono)",color:COLORS[o],background:COLORS_BG[o],padding:"2px 8px",borderRadius:6}}>{m.calc[o]?.pts}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>}

        {MATCHES_W3.length>0&&<>
          <div style={cs.sec}><span style={cs.sectionBar}/>Week 3 · M28+</div>
          {[...MATCHES_W3].reverse().map(m=>(
            <div key={m.id} style={{...cs.row,cursor:"pointer"}} onClick={()=>{setSM(m.id);setView("match");}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:11,color:"#fff",background:"#059669",padding:"3px 8px",borderRadius:5,fontFamily:"var(--font-mono)",fontWeight:600}}>M{m.num}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600}}>{m.teams}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{m.date} · {m.result}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:14}}>
                {Object.keys(TEAMS_W3).map(o=>(
                  <div key={o} style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>{o}</div>
                    <div style={{fontSize:15,fontWeight:700,fontFamily:"var(--font-mono)",color:COLORS[o],background:COLORS_BG[o],padding:"2px 8px",borderRadius:6}}>{m.calc[o]?.pts}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>}

        {MATCHES_W2.length>0&&<>
          <div style={cs.sec}><span style={cs.sectionBar}/>Week 2 · M19–M27</div>
          {[...MATCHES_W2].reverse().map(m=>(
            <div key={m.id} style={{...cs.row,cursor:"pointer"}} onClick={()=>{setSM(m.id);setView("match");}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:11,color:"#fff",background:"#7c3aed",padding:"3px 8px",borderRadius:5,fontFamily:"var(--font-mono)",fontWeight:600}}>M{m.num}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600}}>{m.teams}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{m.date} · {m.result}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:14}}>
                {Object.keys(TEAMS_W2).map(o=>(
                  <div key={o} style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>{o}</div>
                    <div style={{fontSize:15,fontWeight:700,fontFamily:"var(--font-mono)",color:COLORS[o],background:COLORS_BG[o],padding:"2px 8px",borderRadius:6}}>{m.calc[o]?.pts}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>}

        <div style={cs.sec}><span style={cs.sectionBar}/>Week 1 · M9–M18</div>
        {[...MATCHES].reverse().map(m=>(
          <div key={m.id} style={cs.row} onClick={()=>{setSM(m.id);setView("match");}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:11,color:"#fff",background:"#1e3a5f",padding:"3px 8px",borderRadius:5,fontFamily:"var(--font-mono)",fontWeight:600}}>M{m.num}</span>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{m.teams}</div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{m.date} · {m.result}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:14}}>
              {Object.keys(TEAMS).map(o=>(
                <div key={o} style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>{o}</div>
                  <div style={{fontSize:15,fontWeight:700,fontFamily:"var(--font-mono)",color:COLORS[o],background:COLORS_BG[o],padding:"2px 8px",borderRadius:6}}>{m.calc[o]?.pts}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>}

      {view==="week1"&&<>
        {/* MVP Top 3 */}
        {(()=>{
          const allPlayers={};
          Object.keys(TEAMS).forEach(owner=>{
            TEAMS[owner].forEach(name=>{
              if(!allPlayers[name]) allPlayers[name]={name,total:0,owner};
              MATCHES.forEach(m=>{
                const p=(m.calc[owner]?.players||[]).find(x=>x.name===name);
                if(p?.played) allPlayers[name].total+=p.total;
              });
            });
          });
          const top3=Object.values(allPlayers).sort((a,b)=>b.total-a.total).slice(0,3);
          const medals=["🥇","🥈","🥉"];
          const sizes=[52,44,40];
          const fSizes=[13,12,11];
          return (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",color:"#1e3a5f",marginBottom:10}}>🏆 Week 1 MVPs</div>
              <div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center"}}>
                {top3.map((p,rank)=>{
                  if(!p) return null;
                  const iplTeam=Object.entries(PLAYER_IPL_TEAM_W2).find(([n])=>n===p.name)?.[1]||"";
                  const tc=IPL_COLORS[iplTeam]||{bg:COLORS[p.owner],fg:"#fff"};
                  return (
                    <div key={p.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:rank===0?1.2:1}}>
                      <div style={{fontSize:rank===0?20:16}}>{medals[rank]}</div>
                      <div style={{
                        width:sizes[rank],height:sizes[rank],borderRadius:"50%",
                        background:`linear-gradient(135deg,${tc.bg},${tc.bg}cc)`,
                        border:`3px solid ${COLORS[p.owner]}`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        flexDirection:"column",
                        boxShadow:`0 4px 12px ${COLORS[p.owner]}44`,
                      }}>
                        <div style={{fontSize:rank===0?14:11,fontWeight:800,color:tc.fg,lineHeight:1}}>
                          {p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                        </div>
                        {iplTeam&&<div style={{fontSize:7,fontWeight:700,color:tc.fg,opacity:0.8,letterSpacing:"0.5px"}}>{iplTeam}</div>}
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:fSizes[rank],fontWeight:700,color:"var(--color-text-primary)",lineHeight:1.2}}>{p.name.split(" ")[0]}</div>
                        <div style={{fontSize:10,fontWeight:800,color:COLORS[p.owner],fontFamily:"var(--font-mono)"}}>{p.total>0?`+${p.total}`:p.total}</div>
                        <div style={{fontSize:9,color:"var(--color-text-tertiary)",fontWeight:600}}>{p.owner}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:32}}>
          {ranked.map(([owner],ri)=>{
            const pm={};
            MATCHES.forEach(m=>(m.calc[owner]?.players||[]).forEach(p=>{
              if(!pm[p.name])pm[p.name]={name:p.name,total:0,apps:0};
              pm[p.name].total+=p.total; if(p.played)pm[p.name].apps++;
            }));
            const sorted=Object.values(pm).filter(p=>TEAMS[owner].includes(p.name)).sort((a,b)=>b.total-a.total);
            return (
              <div key={owner} style={{...cs.card,cursor:"default",borderTop:`4px solid ${COLORS[owner]}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:10,borderBottom:"1px solid var(--color-border-tertiary)"}}>
                  <div>
                    <span style={{fontSize:16}}>{RANK_MEDALS[ri]} </span>
                    <span style={{fontSize:15,fontWeight:700,color:COLORS[owner]}}>{owner}</span>
                  </div>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:17,fontWeight:700,color:"#fff",background:COLORS[owner],padding:"3px 10px",borderRadius:8}}>{totalsW1[owner]}</div>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{background:"var(--color-background-secondary)"}}>
                    <th style={{textAlign:"left",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",borderRadius:"4px 0 0 4px"}}>Player</th>
                    <th style={{textAlign:"center",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>M</th>
                    <th style={{textAlign:"right",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",borderRadius:"0 4px 4px 0"}}>Pts</th>
                  </tr></thead>
                  <tbody>{sorted.map(p=>(
                    <tr key={p.name} style={{borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                      <td style={{padding:"5px 4px",fontSize:12}}>{p.name}</td>
                      <td style={{padding:"5px 4px",textAlign:"center",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",fontSize:11}}>{p.apps}</td>
                      <td style={{padding:"5px 4px",textAlign:"right",...pSt(p.total),fontSize:12}}>{pStr(p.total)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            );
          })}
        </div>
      </>}

      {view==="week2"&&(()=>{
        const totalsW2 = Object.keys(TEAMS_W2).reduce((a,o)=>{
          a[o]=MATCHES_W2.reduce((s,m)=>s+(m.calc[o]?.pts||0),0); return a;
        },{});
        const rankedW2 = Object.entries(totalsW2).sort((a,b)=>b[1]-a[1]);

        if(RAW_W2.length===0) return (
          <div>
            {/* Roster cards */}
            <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:16}}>
              Week 2 rosters locked · Matches from Apr 12 onwards · Scorecards pending
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:24}}>
              {Object.entries(TEAMS_W2).map(([owner,roster],ri)=>(
                <div key={owner} style={{...cs.card,borderTop:`4px solid ${COLORS[owner]}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:10,borderBottom:"1px solid var(--color-border-tertiary)"}}>
                    <div>
                      <span style={{fontSize:16}}>{RANK_MEDALS[ri]} </span>
                      <span style={{fontSize:15,fontWeight:700,color:COLORS[owner]}}>{owner}</span>
                    </div>
                    <span style={{fontSize:11,background:COLORS[owner],color:"#fff",padding:"2px 8px",borderRadius:10,fontWeight:600}}>W2 Roster</span>
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:"var(--color-background-secondary)"}}>
                      <th style={{textAlign:"left",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>#</th>
                      <th style={{textAlign:"left",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Player</th>
                      <th style={{textAlign:"right",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pts</th>
                    </tr></thead>
                    <tbody>{roster.map((name,i)=>(
                      <tr key={name} style={{borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                        <td style={{padding:"5px 4px",fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>{i+1}</td>
                        <td style={{padding:"5px 4px",fontSize:12}}>{name}</td>
                        <td style={{padding:"5px 4px",textAlign:"right",fontFamily:"var(--font-mono)",color:"var(--color-text-tertiary)",fontSize:11}}>—</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ))}
            </div>
            {/* Awaiting matches banner */}
            <div style={{
              background:"linear-gradient(135deg,#1e3a5f,#0f2240)",
              borderRadius:"var(--border-radius-lg)",
              padding:"24px",
              textAlign:"center",
            }}>
              <div style={{fontSize:28,marginBottom:8}}>⏳</div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:6}}>Awaiting Match Scorecards</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>Week 2 matches start Apr 12 · Scores will appear here once match data is added</div>
            </div>
          </div>
        );

        // Once matches exist — player breakdown only (no leaderboard/match rows, those are in Leaderboard tab)
        return (
          <div>
            <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:12}}>
              Week 2 · Apr 12–18 · {MATCHES_W2.length} match{MATCHES_W2.length!==1?"es":""} played
            </div>
            {/* MVP Top 3 */}
            {(()=>{
              const allPlayers={};
              Object.keys(TEAMS_W2).forEach(owner=>{
                TEAMS_W2[owner].forEach(name=>{
                  if(!allPlayers[name]) allPlayers[name]={name,total:0,owner};
                  MATCHES_W2.forEach(m=>{
                    const p=(m.calc[owner]?.players||[]).find(x=>x.name===name);
                    if(p?.played) allPlayers[name].total+=p.total;
                  });
                });
              });
              const top3=Object.values(allPlayers).sort((a,b)=>b.total-a.total).slice(0,3);
              const medals=["🥇","🥈","🥉"];
              const sizes=[52,44,40];
              const fSizes=[13,12,11];
              return (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",color:"#1e3a5f",marginBottom:10}}>🏆 Week 2 MVPs</div>
                  <div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center"}}>
                    {top3.map((p,rank)=>{
                      if(!p) return null;
                      const iplTeam=PLAYER_IPL_TEAM_W2[p.name]||"";
                      const tc=IPL_COLORS[iplTeam]||{bg:COLORS[p.owner],fg:"#fff"};
                      return (
                        <div key={p.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:rank===0?1.2:1}}>
                          <div style={{fontSize:rank===0?20:16}}>{medals[rank]}</div>
                          <div style={{
                            width:sizes[rank],height:sizes[rank],borderRadius:"50%",
                            background:`linear-gradient(135deg,${tc.bg},${tc.bg}cc)`,
                            border:`3px solid ${COLORS[p.owner]}`,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            flexDirection:"column",
                            boxShadow:`0 4px 12px ${COLORS[p.owner]}44`,
                          }}>
                            <div style={{fontSize:rank===0?14:11,fontWeight:800,color:tc.fg,lineHeight:1}}>
                              {p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                            </div>
                            {iplTeam&&<div style={{fontSize:7,fontWeight:700,color:tc.fg,opacity:0.8,letterSpacing:"0.5px"}}>{iplTeam}</div>}
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:fSizes[rank],fontWeight:700,color:"var(--color-text-primary)",lineHeight:1.2}}>{p.name.split(" ")[0]}</div>
                            <div style={{fontSize:10,fontWeight:800,color:COLORS[p.owner],fontFamily:"var(--font-mono)"}}>{p.total>0?`+${p.total}`:p.total}</div>
                            <div style={{fontSize:9,color:"var(--color-text-tertiary)",fontWeight:600}}>{p.owner}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {/* Player breakdown per owner */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
              {Object.entries(TEAMS_W2).map(([owner],ri)=>{
                const pm={};
                MATCHES_W2.forEach(m=>(m.calc[owner]?.players||[]).forEach(p=>{
                  if(!pm[p.name])pm[p.name]={name:p.name,total:0,apps:0};
                  pm[p.name].total+=p.total; if(p.played)pm[p.name].apps++;
                }));
                const sorted=Object.values(pm).filter(p=>TEAMS_W2[owner].includes(p.name)).sort((a,b)=>b.total-a.total);
                return (
                  <div key={owner} style={{...cs.card,borderTop:`4px solid ${COLORS[owner]}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:10,borderBottom:"1px solid var(--color-border-tertiary)"}}>
                      <div>
                        <span style={{fontSize:16}}>{RANK_MEDALS[ri]} </span>
                        <span style={{fontSize:15,fontWeight:700,color:COLORS[owner]}}>{owner}</span>
                      </div>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:17,fontWeight:700,color:"#fff",background:COLORS[owner],padding:"3px 10px",borderRadius:8}}>{totalsW2[owner]}</div>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr style={{background:"var(--color-background-secondary)"}}>
                        <th style={{textAlign:"left",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Player</th>
                        <th style={{textAlign:"center",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>M</th>
                        <th style={{textAlign:"right",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pts</th>
                      </tr></thead>
                      <tbody>{sorted.map(p=>{
                        const ipl=PLAYER_IPL_TEAM_W2[p.name];
                        return (
                        <tr key={p.name} style={{borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                          <td style={{padding:"5px 4px",fontSize:12}}>
                            {p.name}
                            {ipl&&<span style={{marginLeft:5,fontSize:9,fontWeight:700,color:"#6b7280",background:"var(--color-background-secondary)",padding:"1px 4px",borderRadius:3}}>{ipl}</span>}
                          </td>
                          <td style={{padding:"5px 4px",textAlign:"center",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",fontSize:11}}>{p.apps}</td>
                          <td style={{padding:"5px 4px",textAlign:"right",...pSt(p.total),fontSize:12}}>{pStr(p.total)}</td>
                        </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {view==="rosters"&&null}
      {view==="weekly"&&null}

      {view==="week3"&&(()=>{
        return (
          <div>
            <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:12}}>
              Week 3 · {MATCHES_W3.length} match{MATCHES_W3.length!==1?"es":""} played
            </div>
            {/* MVP Top 3 */}
            {MATCHES_W3.length>0&&(()=>{
              const allPlayers={};
              Object.keys(TEAMS_W3).forEach(owner=>{
                (TEAMS_W3[owner]||[]).forEach(name=>{
                  if(!allPlayers[name]) allPlayers[name]={name,total:0,owner};
                  MATCHES_W3.forEach(m=>{
                    const p=(m.calc[owner]?.players||[]).find(x=>x.name===name);
                    if(p?.played) allPlayers[name].total+=p.total;
                  });
                });
              });
              const top3=Object.values(allPlayers).sort((a,b)=>b.total-a.total).slice(0,3);
              const medals=["🥇","🥈","🥉"];
              const sizes=[52,44,40];
              const fSizes=[13,12,11];
              return (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",color:"#1e3a5f",marginBottom:10}}>🏆 Week 3 MVPs</div>
                  <div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center"}}>
                    {top3.map((p,rank)=>{
                      if(!p) return null;
                      const iplTeam=PLAYER_IPL_TEAM_W3[p.name]||"";
                      const tc=IPL_COLORS[iplTeam]||{bg:COLORS[p.owner],fg:"#fff"};
                      return (
                        <div key={p.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:rank===0?1.2:1}}>
                          <div style={{fontSize:rank===0?20:16}}>{medals[rank]}</div>
                          <div style={{width:sizes[rank],height:sizes[rank],borderRadius:"50%",background:`linear-gradient(135deg,${tc.bg},${tc.bg}cc)`,border:`3px solid ${COLORS[p.owner]}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",boxShadow:`0 4px 12px ${COLORS[p.owner]}44`}}>
                            <div style={{fontSize:rank===0?14:11,fontWeight:800,color:tc.fg,lineHeight:1}}>{p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                            {iplTeam&&<div style={{fontSize:7,fontWeight:700,color:tc.fg,opacity:0.8,letterSpacing:"0.5px"}}>{iplTeam}</div>}
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:fSizes[rank],fontWeight:700,color:"var(--color-text-primary)",lineHeight:1.2}}>{p.name.split(" ")[0]}</div>
                            <div style={{fontSize:10,fontWeight:800,color:COLORS[p.owner],fontFamily:"var(--font-mono)"}}>{p.total>0?`+${p.total}`:p.total}</div>
                            <div style={{fontSize:9,color:"var(--color-text-tertiary)",fontWeight:600}}>{p.owner}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {/* Player breakdown per owner */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
              {Object.entries(TEAMS_W3).map(([owner,roster],ri)=>{
                const pm={};
                MATCHES_W3.forEach(m=>(m.calc[owner]?.players||[]).forEach(p=>{
                  if(!pm[p.name])pm[p.name]={name:p.name,total:0,apps:0};
                  pm[p.name].total+=p.total; if(p.played)pm[p.name].apps++;
                }));
                const sorted=Object.values(pm).filter(p=>(TEAMS_W3[owner]||[]).includes(p.name)).sort((a,b)=>b.total-a.total);
                // Add players who haven't played yet
                (roster||[]).forEach(name=>{if(!pm[name])sorted.push({name,total:0,apps:0});});
                return (
                  <div key={owner} style={{...cs.card,borderTop:`4px solid ${COLORS[owner]}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:10,borderBottom:"1px solid var(--color-border-tertiary)"}}>
                      <div>
                        <span style={{fontSize:16}}>{RANK_MEDALS[ri]} </span>
                        <span style={{fontSize:15,fontWeight:700,color:COLORS[owner]}}>{owner}</span>
                      </div>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:17,fontWeight:700,color:"#fff",background:COLORS[owner],padding:"3px 10px",borderRadius:8}}>{totalsW3[owner]||0}</div>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr style={{background:"var(--color-background-secondary)"}}>
                        <th style={{textAlign:"left",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Player</th>
                        <th style={{textAlign:"center",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>M</th>
                        <th style={{textAlign:"right",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pts</th>
                      </tr></thead>
                      <tbody>{sorted.map(p=>{
                        const ipl=PLAYER_IPL_TEAM_W3[p.name];
                        return (
                          <tr key={p.name} style={{borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                            <td style={{padding:"5px 4px",fontSize:12}}>
                              {p.name}
                              {ipl&&<span style={{marginLeft:5,fontSize:9,fontWeight:700,color:"#6b7280",background:"var(--color-background-secondary)",padding:"1px 4px",borderRadius:3}}>{ipl}</span>}
                            </td>
                            <td style={{padding:"5px 4px",textAlign:"center",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",fontSize:11}}>{p.apps||0}</td>
                            <td style={{padding:"5px 4px",textAlign:"right",...pSt(p.total),fontSize:12}}>{pStr(p.total)}</td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {view==="week4"&&(()=>{
        return (
          <div>
            <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:12}}>
              Week 4 · {MATCHES_W4.length} match{MATCHES_W4.length!==1?"es":""} played · Auction complete
            </div>
            {MATCHES_W4.length>0&&(()=>{
              const allPlayers={};
              Object.keys(TEAMS_W4).forEach(owner=>{
                (TEAMS_W4[owner]||[]).forEach(name=>{
                  if(!allPlayers[name]) allPlayers[name]={name,total:0,owner};
                  MATCHES_W4.forEach(m=>{
                    const p=(m.calc[owner]?.players||[]).find(x=>x.name===name);
                    if(p?.played) allPlayers[name].total+=p.total;
                  });
                });
              });
              const top3=Object.values(allPlayers).sort((a,b)=>b.total-a.total).slice(0,3);
              const medals=["🥇","🥈","🥉"];
              const sizes=[52,44,40];
              return (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",color:"#1e3a5f",marginBottom:10}}>🏆 Week 4 MVPs</div>
                  <div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center"}}>
                    {top3.map((p,rank)=>{
                      if(!p) return null;
                      const iplTeam=PLAYER_IPL_TEAM_W4[p.name]||"";
                      const tc=IPL_COLORS[iplTeam]||{bg:COLORS[p.owner],fg:"#fff"};
                      return (
                        <div key={p.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:rank===0?1.2:1}}>
                          <div style={{fontSize:rank===0?20:16}}>{medals[rank]}</div>
                          <div style={{width:sizes[rank],height:sizes[rank],borderRadius:"50%",background:`linear-gradient(135deg,${tc.bg},${tc.bg}cc)`,border:`3px solid ${COLORS[p.owner]}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",boxShadow:`0 4px 12px ${COLORS[p.owner]}44`}}>
                            <div style={{fontSize:rank===0?14:11,fontWeight:800,color:tc.fg,lineHeight:1}}>{p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                            {iplTeam&&<div style={{fontSize:7,fontWeight:700,color:tc.fg,opacity:0.8}}>{iplTeam}</div>}
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:sizes[rank]===52?13:rank===1?12:11,fontWeight:700,color:"var(--color-text-primary)",lineHeight:1.2}}>{p.name.split(" ")[0]}</div>
                            <div style={{fontSize:10,fontWeight:800,color:COLORS[p.owner],fontFamily:"var(--font-mono)"}}>{p.total>0?`+${p.total}`:p.total}</div>
                            <div style={{fontSize:9,color:"var(--color-text-tertiary)",fontWeight:600}}>{p.owner}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
              {Object.entries(TEAMS_W4).map(([owner,roster],ri)=>{
                const pm={};
                MATCHES_W4.forEach(m=>(m.calc[owner]?.players||[]).forEach(p=>{
                  if(!pm[p.name])pm[p.name]={name:p.name,total:0,apps:0};
                  pm[p.name].total+=p.total; if(p.played)pm[p.name].apps++;
                }));
                const sorted=Object.values(pm).filter(p=>(TEAMS_W4[owner]||[]).includes(p.name)).sort((a,b)=>{
                  const ta=PLAYER_IPL_TEAM_W4[a.name]||"ZZZ";
                  const tb=PLAYER_IPL_TEAM_W4[b.name]||"ZZZ";
                  return ta===tb?a.name.localeCompare(b.name):ta.localeCompare(tb);
                });
                (roster||[]).forEach(name=>{if(!pm[name])sorted.push({name,total:0,apps:0});});
                // Re-sort including non-played players by team
                sorted.sort((a,b)=>{
                  const ta=PLAYER_IPL_TEAM_W4[a.name]||"ZZZ";
                  const tb=PLAYER_IPL_TEAM_W4[b.name]||"ZZZ";
                  return ta===tb?a.name.localeCompare(b.name):ta.localeCompare(tb);
                });
                return (
                  <div key={owner} style={{...cs.card,borderTop:`4px solid ${COLORS[owner]}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:10,borderBottom:"1px solid var(--color-border-tertiary)"}}>
                      <div>
                        <span style={{fontSize:16}}>{RANK_MEDALS[ri]} </span>
                        <span style={{fontSize:15,fontWeight:700,color:COLORS[owner]}}>{owner}</span>
                      </div>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:17,fontWeight:700,color:"#fff",background:COLORS[owner],padding:"3px 10px",borderRadius:8}}>{totalsW4[owner]||0}</div>
                    </div>
                    {(roster||[]).length===0
                      ? <div style={{fontSize:12,color:"var(--color-text-tertiary)",fontStyle:"italic"}}>Roster pending...</div>
                      : <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                          <thead><tr style={{background:"var(--color-background-secondary)"}}>
                            <th style={{textAlign:"left",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Player</th>
                            <th style={{textAlign:"center",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>M</th>
                            <th style={{textAlign:"right",padding:"5px 6px",fontSize:10,color:"var(--color-text-secondary)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pts</th>
                          </tr></thead>
                          <tbody>{sorted.map((p,idx)=>{
                            const ipl=PLAYER_IPL_TEAM_W4[p.name];
                            const prevIpl=idx>0?PLAYER_IPL_TEAM_W4[sorted[idx-1].name]:null;
                            const newGroup=idx>0&&ipl!==prevIpl;
                            return (
                              <tr key={p.name} style={{borderTop:newGroup?"2px solid var(--color-border-secondary)":"0.5px solid var(--color-border-tertiary)"}}>
                                <td style={{padding:"5px 4px",fontSize:12}}>
                                  {p.name}
                                  {ipl&&<span style={{marginLeft:5,fontSize:9,fontWeight:700,color:"#6b7280",background:"var(--color-background-secondary)",padding:"1px 4px",borderRadius:3}}>{ipl}</span>}
                                </td>
                                <td style={{padding:"5px 4px",textAlign:"center",color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)",fontSize:11}}>{p.apps||0}</td>
                                <td style={{padding:"5px 4px",textAlign:"right",...pSt(p.total),fontSize:12}}>{pStr(p.total)}</td>
                              </tr>
                            );
                          })}</tbody>
                        </table>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {view==="universe"&&(()=>{
        const owners = Object.keys(TEAMS);
        // Build player → owner → total pts map across both weeks
        // Key insight: ownership follows the week's roster, not one fixed team
        const playerMap = {};

        // Register all players from W1, W2 and W3 rosters
        owners.forEach(owner => {
          TEAMS[owner].forEach(name => {
            if (!playerMap[name]) playerMap[name] = { name, ownerPts: {}, total: 0 };
            if (playerMap[name].ownerPts[owner] === undefined) playerMap[name].ownerPts[owner] = 0;
          });
          TEAMS_W2[owner].forEach(name => {
            if (!playerMap[name]) playerMap[name] = { name, ownerPts: {}, total: 0 };
            if (playerMap[name].ownerPts[owner] === undefined) playerMap[name].ownerPts[owner] = 0;
          });
          (TEAMS_W3[owner]||[]).forEach(name => {
            if (!playerMap[name]) playerMap[name] = { name, ownerPts: {}, total: 0 };
            if (playerMap[name].ownerPts[owner] === undefined) playerMap[name].ownerPts[owner] = 0;
          });
          (TEAMS_W4[owner]||[]).forEach(name => {
            if (!playerMap[name]) playerMap[name] = { name, ownerPts: {}, total: 0 };
            if (playerMap[name].ownerPts[owner] === undefined) playerMap[name].ownerPts[owner] = 0;
          });
        });

        // W1 points — attributed to W1 owner
        MATCHES.forEach(m => {
          owners.forEach(owner => {
            (m.calc[owner]?.players || []).forEach(p => {
              if (p.played && playerMap[p.name] && playerMap[p.name].ownerPts[owner] !== undefined) {
                playerMap[p.name].ownerPts[owner] += p.total;
                playerMap[p.name].total += p.total;
              }
            });
          });
        });

        // W2 points — attributed to W2 owner
        MATCHES_W2.forEach(m => {
          owners.forEach(owner => {
            (m.calc[owner]?.players || []).forEach(p => {
              if (p.played && playerMap[p.name] && playerMap[p.name].ownerPts[owner] !== undefined) {
                playerMap[p.name].ownerPts[owner] += p.total;
                playerMap[p.name].total += p.total;
              }
            });
          });
        });

        // W4 points — attributed to W4 owner
        MATCHES_W4.forEach(m => {
          owners.forEach(owner => {
            (m.calc[owner]?.players || []).forEach(p => {
              if (p.played && playerMap[p.name] && playerMap[p.name].ownerPts[owner] !== undefined) {
                playerMap[p.name].ownerPts[owner] += p.total;
                playerMap[p.name].total += p.total;
              }
            });
          });
        });

        // W3 points — attributed to W3 owner
        MATCHES_W3.forEach(m => {
          owners.forEach(owner => {
            (m.calc[owner]?.players || []).forEach(p => {
              if (p.played && playerMap[p.name] && playerMap[p.name].ownerPts[owner] !== undefined) {
                playerMap[p.name].ownerPts[owner] += p.total;
                playerMap[p.name].total += p.total;
              }
            });
          });
        });

        const rows = Object.values(playerMap).sort((a,b) => b.total - a.total);
        const thStyle = { padding:"8px 10px", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"rgba(255,255,255,0.8)", textAlign:"right", whiteSpace:"nowrap", background:"#1e3a5f" };
        const tdStyle = { padding:"6px 10px", fontSize:12, borderBottom:"0.5px solid var(--color-border-tertiary)", textAlign:"right", fontFamily:"var(--font-mono)" };
        return (
          <div style={{borderRadius:"var(--border-radius-lg)",border:"1px solid var(--color-border-tertiary)",overflow:"hidden"}}>
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
            <table style={{width:"100%",minWidth:380,borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr>
                  <th style={{...thStyle,textAlign:"left",minWidth:130,position:"sticky",left:0,zIndex:2}}>Player</th>
                  {owners.map(o=>(
                    <th key={o} style={{...thStyle,color:COLORS[o],minWidth:68}}>{o}</th>
                  ))}
                  <th style={{...thStyle,color:"#f59e0b",minWidth:60}}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p,i)=>(
                  <tr key={p.name} style={{background:i%2===0?"var(--color-background-primary)":"var(--color-background-secondary)"}}>
                    <td style={{...tdStyle,textAlign:"left",fontFamily:"var(--font-sans)",fontWeight:p.total>0?600:400,color:p.total>0?"var(--color-text-primary)":"var(--color-text-tertiary)",position:"sticky",left:0,background:i%2===0?"var(--color-background-primary)":"var(--color-background-secondary)",zIndex:1}}>{p.name}</td>
                    {owners.map(o=>{
                      const owned = p.ownerPts[o] !== undefined;
                      const pts = p.ownerPts[o] || 0;
                      return (
                        <td key={o} style={{...tdStyle, color: owned ? (pts>0 ? COLORS[o] : "var(--color-text-tertiary)") : "var(--color-text-tertiary)", fontWeight: pts>0?700:400, background: owned&&pts>0?COLORS_BG[o]:"transparent"}}>
                          {owned ? (pts > 0 ? `+${pts}` : "0") : "—"}
                        </td>
                      );
                    })}
                    <td style={{...tdStyle, fontWeight:700, color: p.total>0?"#1e3a5f":"var(--color-text-tertiary)"}}>{p.total>0?`+${p.total}`:p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        );
      })()}

      {view==="scoring"&&(()=>{
        const Section = ({icon, title, color, children}) => (
          <div style={{
            background:"var(--color-background-primary)",
            border:`1px solid var(--color-border-tertiary)`,
            borderRadius:"var(--border-radius-lg)",
            overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            marginBottom:16,
          }}>
            <div style={{
              background:`linear-gradient(135deg,${color}18,${color}08)`,
              borderBottom:`2px solid ${color}`,
              padding:"14px 20px",
              display:"flex",alignItems:"center",gap:10,
            }}>
              <span style={{fontSize:22}}>{icon}</span>
              <span style={{fontSize:16,fontWeight:700,color}}>{title}</span>
            </div>
            <div style={{padding:"16px 20px"}}>{children}</div>
          </div>
        );

        const Row = ({label, pts, note, highlight}) => (
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"9px 12px",
            marginBottom:4,
            borderRadius:8,
            background: highlight ? "rgba(245,158,11,0.06)" : "var(--color-background-secondary)",
            border: highlight ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
          }}>
            <div>
              <span style={{fontSize:13,fontWeight:highlight?600:400}}>{label}</span>
              {note && <span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:8}}>{note}</span>}
            </div>
            <span style={{
              fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700,
              color: pts>0?"#059669":pts<0?"#dc2626":"var(--color-text-tertiary)",
              background: pts>0?"#d1fae5":pts<0?"#fee2e2":"var(--color-background-primary)",
              padding:"2px 10px",borderRadius:6,minWidth:52,textAlign:"center",
            }}>{pts>0?`+${pts}`:pts}</span>
          </div>
        );

        const Divider = ({label}) => (
          <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0 8px"}}>
            <div style={{flex:1,height:1,background:"var(--color-border-tertiary)"}}/>
            <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"var(--color-text-tertiary)"}}>{label}</span>
            <div style={{flex:1,height:1,background:"var(--color-border-tertiary)"}}/>
          </div>
        );

        return (
          <div>
            <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:20}}>
              Complete scoring rules for the IPL Owner League 2026 fantasy competition.
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>

              {/* BATTING */}
              <Section icon="🏏" title="Batting" color="#f59e0b">
                <Divider label="Base runs"/>
                <Row label="Each run scored" pts={1}/>
                <Row label="Each boundary (4)" pts={1} note="on top of run"/>
                <Row label="Each six (6)" pts={2} note="on top of run"/>
                <Row label="Duck (dismissed for 0)" pts={-2}/>
                <Divider label="Milestone bonus (not cumulative)"/>
                <Row label="30+ runs" pts={4}/>
                <Row label="50+ runs" pts={8} highlight/>
                <Row label="100+ runs" pts={16} highlight/>
                <Divider label="Strike rate bonus (min 10 balls)"/>
                <Row label="SR 150–169" pts={4}/>
                <Row label="SR 170+" pts={6} highlight/>
              </Section>

              {/* BOWLING */}
              <Section icon="🎯" title="Bowling" color="#8b5cf6">
                <Divider label="Wickets"/>
                <Row label="Each wicket" pts={25}/>
                <Row label="LBW or Bowled bonus" pts={8} note="per wicket"/>
                <Divider label="Haul bonus (not cumulative)"/>
                <Row label="3 wickets" pts={4}/>
                <Row label="4 wickets" pts={8} highlight/>
                <Row label="5 wickets" pts={16} highlight/>
                <Divider label="Dots & economy"/>
                <Row label="Each dot ball" pts={1}/>
                <Row label="Each maiden over" pts={12}/>
                <Row label="Economy < 5.00" pts={6} note="min 2 overs" highlight/>
                <Row label="Economy 5.00–7.00" pts={4} note="min 2 overs"/>
              </Section>

              {/* FIELDING */}
              <Section icon="🧤" title="Fielding" color="#10b981">
                <Divider label="Dismissals"/>
                <Row label="Each catch" pts={8}/>
                <Row label="3+ catches in match" pts={4} note="bonus"/>
                <Row label="Stumping" pts={12}/>
              </Section>

            </div>

            {/* QUICK EXAMPLE */}
            <div style={{
              marginTop:4,
              background:"linear-gradient(135deg,#1e3a5f,#0f2240)",
              borderRadius:"var(--border-radius-lg)",
              padding:"18px 22px",
            }}>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:12}}>📊 Example calculation</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
                <div>
                  <div style={{fontSize:12,color:"#f59e0b",fontWeight:700,marginBottom:8}}>🏏 Batsman: 78 off 26 (8×4, 7×6)</div>
                  {[["78 runs","78"],["8 boundaries","8"],["7 sixes","14"],["50+ milestone","8"],["SR 300 (≥170)","6"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.75)",marginBottom:3}}>
                      <span>{l}</span><span style={{color:"#86efac",fontFamily:"var(--font-mono)"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,color:"#fff"}}>
                    <span>Total</span><span style={{color:"#4ade80",fontFamily:"var(--font-mono)"}}>=114</span>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:12,color:"#8b5cf6",fontWeight:700,marginBottom:8}}>🎯 Bowler: 4/19 in 4 overs, 10 dots</div>
                  {[["4 wickets","100"],["4-wkt haul bonus","8"],["10 dots","10"],["Eco 4.75 (<5)","6"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.75)",marginBottom:3}}>
                      <span>{l}</span><span style={{color:"#c4b5fd",fontFamily:"var(--font-mono)"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,color:"#fff"}}>
                    <span>Total</span><span style={{color:"#a78bfa",fontFamily:"var(--font-mono)"}}>=124</span>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:12,color:"#10b981",fontWeight:700,marginBottom:8}}>🧤 WK: 1 catch, 2 stumpings</div>
                  {[["1 catch","8"],["2 stumpings","24"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.75)",marginBottom:3}}>
                      <span>{l}</span><span style={{color:"#6ee7b7",fontFamily:"var(--font-mono)"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,color:"#fff"}}>
                    <span>Total</span><span style={{color:"#34d399",fontFamily:"var(--font-mono)"}}>=32</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {view==="match"&&(()=>{
        const m=MATCHES.find(x=>x.id===selM)||MATCHES_W2.find(x=>x.id===selM)||MATCHES_W3.find(x=>x.id===selM)||MATCHES_W4.find(x=>x.id===selM);
        if(!m)return null;
        const isW2=!!MATCHES_W2.find(x=>x.id===selM);
        const isW3=!!MATCHES_W3.find(x=>x.id===selM);
        const isW4=!!MATCHES_W4.find(x=>x.id===selM);
        const teamsObj=isW4?TEAMS_W4:isW3?TEAMS_W3:isW2?TEAMS_W2:TEAMS;
        return <>
          <button style={cs.btn} onClick={()=>setView("leaderboard")}>← Back to leaderboard</button>
          <div style={{margin:"14px 0 20px",padding:"16px 20px",background:"linear-gradient(135deg,#1e3a5f,#0f2240)",borderRadius:"var(--border-radius-lg)"}}>
            <div style={{fontSize:20,fontWeight:700,color:"#fff"}}>{m.teams}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:4}}>{m.date} · Match {m.num} · {m.result}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
            {Object.keys(teamsObj).map(owner=>{
              const d=m.calc[owner];
              const played=(d?.players||[]).filter(p=>p.played).sort((a,b)=>b.total-a.total);
              const bench=(d?.players||[]).filter(p=>!p.played);
              return (
                <div key={owner} style={{...cs.card,cursor:"default",borderTop:`4px solid ${COLORS[owner]}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:8,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                    <div style={{fontWeight:700,color:COLORS[owner],fontSize:15}}>{owner}</div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:18,fontWeight:700,color:"#fff",background:COLORS[owner],padding:"2px 10px",borderRadius:8}}>{d?.pts||0}</div>
                  </div>
                  {played.length===0&&<div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>No players in this match</div>}
                  {played.map(p=>(
                    <div key={p.name} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div style={{flex:1,marginRight:8}}>
                        <div style={{fontSize:13}}>{p.name}</div>
                        {p.bd?.length>0&&<div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:2}}>{p.bd.join(" · ")}</div>}
                      </div>
                      <div style={pSt(p.total)}>{pStr(p.total)}</div>
                    </div>
                  ))}
                  {bench.length>0&&<div style={{marginTop:8,paddingTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",fontSize:11,color:"var(--color-text-tertiary)"}}>Did not play: {bench.map(p=>p.name).join(", ")}</div>}
                </div>
              );
            })}
          </div>
        </>;
      })()}

      {view==="owner"&&(()=>(
        <>
          <button style={cs.btn} onClick={()=>setView("leaderboard")}>← Back to leaderboard</button>
          <div style={{margin:"14px 0 20px",padding:"16px 20px",background:`linear-gradient(135deg,${COLORS[selO]}22,${COLORS[selO]}08)`,borderRadius:"var(--border-radius-lg)",border:`2px solid ${COLORS[selO]}44`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:22,fontWeight:700,color:COLORS[selO]}}>{selO}'s Week 1</div>
              <div style={{fontSize:13,color:"var(--color-text-secondary)",marginTop:2}}>Match-by-match breakdown</div>
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:28,fontWeight:700,color:"#fff",background:COLORS[selO],padding:"6px 16px",borderRadius:10}}>{totals[selO]}</div>
          </div>
          {MATCHES.map(m=>{
            const played=(m.calc[selO]?.players||[]).filter(p=>p.played).sort((a,b)=>b.total-a.total);
            if(!played.length)return null;
            return (
              <div key={m.id} style={{...cs.card,cursor:"default",marginBottom:12,borderLeft:`4px solid ${COLORS[selO]}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,paddingBottom:8,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <div>
                    <span style={{fontSize:11,color:"#fff",background:"#1e3a5f",fontFamily:"var(--font-mono)",marginRight:8,padding:"2px 7px",borderRadius:4,fontWeight:600}}>M{m.num}</span>
                    <span style={{fontSize:14,fontWeight:600}}>{m.teams}</span>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)",marginLeft:8}}>{m.date}</span>
                  </div>
                  <div style={{fontFamily:"var(--font-mono)",fontWeight:700,color:"#fff",background:COLORS[selO],padding:"2px 10px",borderRadius:6,fontSize:14}}>{m.calc[selO]?.pts} pts</div>
                </div>
                {played.map(p=>(
                  <div key={p.name} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:500}}>{p.name}</div>
                      {p.bd?.length>0&&<div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{p.bd.join(" · ")}</div>}
                    </div>
                    <div style={pSt(p.total)}>{pStr(p.total)}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </>
      ))()}
    </div>
  );
}
