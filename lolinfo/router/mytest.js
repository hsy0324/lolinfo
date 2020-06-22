module.exports = function(app){

    var request = require("request");
    var urlenconde = require('urlencode');
    var apikey = "RGAPI-b69c36b5-e5c6-4698-af93-4be17fc8a7e4"//api
    
    var profileIconId;  //아이콘 번호
    var revisionDate; //수정날짜
    var id; //소환사ID
    var accountId; //계정Id
    var name; //소환사 이름
    var summonerLevel;  //소환사
    var rotation_champ = new Array();
    var rotation_champ_newbie = new Array();
    
      app.get('/', function(req, res) {
            res.render('main', { title: 'LOL INFO' });
      });
    
      app.get('/search/:username/', function(req, res, next){
        //롤 api url
        name = req.params.username;
        var nameUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + urlenconde(name)+"?api_key="+ apikey;
        request(nameUrl,function(error,response,body){
    
            // 요청에 대한 응답이 성공적으로 왔는지 검사.
            // status code가 200이 아니면 오류가 있었던 것으로 간주하고 함수 종료.
            console.log('response code ', response.statusCode);
            if (response.statusCode != 200) {
                console.log('Error with response code22 ', response.statusCode);
                res.end();
                return;
            }
    
          var info_summoner_json = JSON.parse(body);
    
          accountId = info_summoner_json["accountId"];
          id = info_summoner_json["id"];
          summoner = info_summoner_json["name"];
          profileIconId = info_summoner_json["profileIconId"];
          summonerLevel = info_summoner_json["summonerLevel"];
          revisionDate = info_summoner_json["revisionDate"];
          console.log(info_summoner_json);
    
          var champUrl = "https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + urlenconde(id) + "?api_key=" + apikey;
          request(champUrl,function(error,response,body){
            var info_champ_json = JSON.parse(body);
            var champ_point = new Array();
            var champ_id = new Array();
            var champ_name = new Array();
            var rotation_name = new Array();
            var rotation_name_newbie = new Array();
            var champ_pic = new Array();
            var rotation_pic =new Array();
            var rotation_pic_newbie = new Array();
            var champions_length = Object.keys(info_champ_json).length;
    
            // status code가 200이 아니면 종료.
            if (info_champ_json["status"] != undefined) {
                if (info_champ_json["status"]["status_code"] != 200) {
                    console.log('Error with response code11 ', info_champ_json["status"]["status_code"]);
                    res.end();
                    return;
                }
            }
    
            for(var i=0; i < champions_length; i++){
              champ_point[i] = (info_champ_json[i]["championPoints"]);
              champ_id[i] = info_champ_json[i]["championId"];
            }
            var rotationUrl = "https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key="+apikey;
            request(rotationUrl,function(error,response,body){
              var info_rotation = JSON.parse(body);
              var keys = Object.keys(info_rotation);
              for(var k =0; k < info_rotation[keys[0]].length;k++)
                rotation_champ[k] = info_rotation[keys[0]][k];
              for(var k =0; k < info_rotation[keys[1]].length;k++)
                rotation_champ_newbie[k] = info_rotation[keys[1]][k];
    
    
    
    
    
            var staticUrl = "http://ddragon.leagueoflegends.com/cdn/10.11.1/data/en_US/champion.json";
            request(staticUrl,function(error,response,body) {
              var info_static_champ_json = JSON.parse(body);
              console.log(info_static_champ_json.data);
              var champion = info_static_champ_json["data"];
              var champ_count = 0;

              for(var name in champion) {
                if(champion.hasOwnProperty(name)) {
                  champ_count++;
                }
              }

              for(var i=0; i < champ_count; i++){
                    for(js in champion) {
                      for(j in champion[js]) {
                        if(champion[js]["key"] == champ_id[i]){
                          champ_name[i] = champion[js]["id"];
                          champ_pic[i] = "http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champ_name[i]+".png";
    
                        }
                      }
                    }
              }
              for(var i=0; i < champ_count; i++){
                    for(js in champion){
                      for(j in champion[js]){
                        if(champion[js]["key"] == rotation_champ[i]){
                          rotation_name[i] = champion[js]["id"];
                          rotation_pic[i] = "http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+rotation_name[i]+".png";
                        }
                        if(champion[js]["key"] == rotation_champ_newbie[i]){
                          rotation_name_newbie[i] = champion[js]["id"]
                          rotation_pic_newbie[i] = "http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+rotation_name_newbie[i]+".png";
                        }
                      }
                    }
              }
    
              var userLeagueUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+ urlenconde(id)+"?api_key=" + apikey;
              request(userLeagueUrl,function(error,response,body){
                var info_user_league_json = JSON.parse(body);
                //console.log("userLeagueUrl:", userLeagueUrl);
                if(info_user_league_json[0] != null){
                var leagueId = info_user_league_json[0]["leagueId"];
                var wins = info_user_league_json[0]["wins"];
                var losses = info_user_league_json[0]["losses"];
                var leagueName = info_user_league_json[0]["leagueName"]
                var tier = info_user_league_json[0]["tier"];
                var rank = info_user_league_json[0]["rank"];
                var leaguePoints = info_user_league_json[0]["leaguePoints"];
                var img_tier;
                if(tier == "MASTER"){
                  img_tier = "/ranked-emblems/Emblem_Master.png";
                }else if(tier == "CHALLENGER"){
                  img_tier = "/ranked-emblems/Emblem_Challenger.png";
                }else if(tier == "DIAMOND"){
                  img_tier = "/ranked-emblems/Emblem_Diamond.png"
                }else if(tier == "PLATINUM"){
                  img_tier = "/ranked-emblems/Emblem_Platinum.png"
                }else if(tier == "GRANDMASTER"){
                  img_tier = "/ranked-emblems/Emblem_Grandmaster.png"
                }else if(tier == "GOLD"){
                  img_tier = "/ranked-emblems/Emblem_Gold.png"
                }else if(tier == "SILVER"){
                  img_tier = "/ranked-emblems/Emblem_Silver.png"
                }else if(tier == "BRONZE"){
                  img_tier ="/ranked-emblems/Emblem_Bronze.png"
                }else{
                  img_tier = "/ranked-emblems/Emblem_Iron.png"
                }


            }
              champ_name[champ_name.length] = "total";
              var temp_id;
              var temp_name;
              var temp_point;
              var temp_pic;
              for(var i=0; i < champ_id.length-1; i++){
                for(var j=i+1;j <champ_id.length-1; j++)
                if(champ_point[i] > champ_point[j]){
                  temp_id = champ_id[i];
                  temp_name = champ_name[i];
                  temp_point = champ_point[i];
                  temp_pic = champ_pic[i];
                  champ_id[i] = champ_id[j]
                  champ_name[i] = champ_name[j];
                  champ_point[i] = champ_point[j];
                  champ_pic[i] = champ_pic[j];
                  champ_id[j] = temp_id
                  champ_name[j] = temp_name;
                  champ_point[j] = temp_point;
                  champ_pic[j] = temp_pic;
                }
              }
             const defaultMMR = [
               {"mmr" : 900, "tier" : "iron", "rank": 4},
               {"mmr" : 950, "tier" : "iron", "rank": 3},
               {"mmr" : 1000, "tier" : "iron", "rank": 2},
               {"mmr" : 1050, "tier" : "iron", "rank": 1},
               { "mmr" : 1100, "tier" : "bronze", "rank": 4 },
               { "mmr" : 1150, "tier" : "bronze", "rank": 3 },
               { "mmr" : 1200, "tier" : "bronze", "rank": 2 },
               { "mmr" : 1250, "tier" : "bronze", "rank": 1 },
               { "mmr" : 1300, "tier" : "silver", "rank": 4 },
               { "mmr" : 1350, "tier" : "silver", "rank": 3 },
               { "mmr" : 1400, "tier" : "silver", "rank": 2 },
               { "mmr" : 1450, "tier" : "silver", "rank": 1 },
               { "mmr" : 1500, "tier" : "gold", "rank": 4 },
               { "mmr" : 1550, "tier" : "gold", "rank": 3 },
               { "mmr" : 1600, "tier" : "gold", "rank": 2 },
               { "mmr" : 1650, "tier" : "gold", "rank": 1 },
               { "mmr" : 1700, "tier" : "platinum", "rank": 4 },
               { "mmr" : 1750, "tier" : "platinum", "rank": 3 },
               { "mmr" : 1800, "tier" : "platinum", "rank": 2 },
               { "mmr" : 1850, "tier" : "platinum", "rank": 1 },
               { "mmr" : 1900, "tier" : "diamond", "rank": 4 },
               { "mmr" : 1950, "tier" : "diamond", "rank": 3 },
               { "mmr" : 2000, "tier" : "diamond", "rank": 2 },
               { "mmr" : 2050, "tier" : "diamond", "rank": 1 },
               { "mmr" : 2100, "tier" : "master", "rank": 1 },
               { "mmr" : 2700, "tier" : "challenger", "rank": 1 },
             ]

            var spellUrl = "http://ddragon.leagueoflegends.com/cdn/10.12.1/data/en_US/summoner.json";
            request(spellUrl,function(error,response,body){
              var spell = (JSON.parse(body)).data;
              console.log(spell);


            var spectatorUrl = "https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + urlenconde(id) + "?api_key=" + apikey;
            request(spectatorUrl,function(error,response,body) {
              var flag = true;  // 실시간 경기 여부

              if(response.statusCode != 200)
                flag = false;

              if(flag) {  // 실시간 경기 진행중이면
                var spectator_json = JSON.parse(body);
                console.log(spectator_json);
                var spec_bannedChamp = spectator_json.bannedChampions;
                var spec_gameId = spectator_json.gameId;
                var spec_gameLength = spectator_json.gameLength;
                var spec_gameMode = spectator_json.gameMode;
                var spec_QueueId = spectator_json.gameQueueConfigId;
                var spec_mapId = spectator_json.mapId;
                var spec_participants = spectator_json.participants;

                var spec_bannedChamp_image = new Array();
                var spec_selectedChamp_image = new Array();
                var spec_summonerName = new Array();
                var spec_spellId = new Array();
                var spec_spell_image = new Array();
                for(var i=0; i<10; i++){
                  spec_summonerName.push(spec_participants[i].summonerName);
                  spec_spellId.push(spec_participants[i].spell1Id);
                  spec_spellId.push(spec_participants[i].spell2Id);
                }

                for(var i=0; i<10; i++) {
                  for(key in champion) {
                    if(champion.hasOwnProperty(key) && champion[key].key == spec_bannedChamp[i].championId) {
                      spec_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                    }
                    if(champion.hasOwnProperty(key) && champion[key].key == spec_participants[i].championId) {
                      spec_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                    }
                  }
                }

                for(var i=0; i<20; i++) {
                  for(key in spell){
                    if(spell.hasOwnProperty(key) && spell[key].key == spec_spellId[i]){
                      spec_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/"+spell[key].id+".png");
                    }
                  }
                }

                var spectator = {
                  "summonerName" : spec_summonerName,
                  "selectedChamp_image" : spec_selectedChamp_image,
                  "bannedChamp_image" : spec_bannedChamp_image,
                  "spell_image" : spec_spell_image
                };
              }


              // 게임정보 불러오기
              var matchUrl = "https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountId + "?api_key=" + apikey;
              request(matchUrl,function(error,response,body) {
                var match_json = JSON.parse(body).matches;
                console.log(match_json);

                var match_gameId = new Array();
                var match_mychamp = new Array();

                var count=0 , idx=0;
                while(count<5){
                  // 420 : 5x5 솔로랭크, 440 : 5x5 자유랭크
                  if(match_json[idx].queue == 420 || match_json[idx].queue == 440){
                  match_gameId.push(match_json[idx].gameId);
                  match_mychamp.push(match_json[idx].champion);
                  count++;
                  }
                  idx++;
                }

                // teamId: 100 = Blue , teamId:200 = Red
                var match1Url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + match_gameId[0] + "?api_key=" + apikey;
                request(match1Url,function(error,response,body){
                  var match1_json = JSON.parse(body);
                  var match1_gameLength = match_json.gameDuration;
                  var match1_teams = match1_json.teams;
                  var match1_participants = match1_json.participants;
                  var match1_participantIdentities = match1_json.participantIdentities;

                  var match1_bannedChamp = new Array();
                  var match1_selectedChamp = new Array();
                  var match1_spellId = new Array();
                  var match1_summonerName = new Array();
                  var match1_kda = new Array();

                  var match1_bannedChamp_image = new Array();
                  var match1_selectedChamp_image = new Array();
                  var match1_spell_image = new Array();

                  for(var i=0; i<2; i++){
                    var temp = match1_teams[i].bans;
                    for(var j=0; j<5; j++){
                      match1_bannedChamp.push(temp[j].championId);
                    }
                  }

                  for(var i=0; i<10; i++){
                    match1_selectedChamp.push(match1_participants[i].championId);
                    match1_spellId.push(match1_participants[i].spell1Id);
                    match1_spellId.push(match1_participants[i].spell2Id);
                    match1_summonerName.push((match1_participantIdentities[i].player).summonerName);
                    var obj = {
                      'k' : (match1_participants[i].stats).kills,
                      'd' : (match1_participants[i].stats).deaths,
                      'a' : (match1_participants[i].stats).assists
                    };
                    match1_kda.push(obj);
                  }

                  for(var i=0; i<10; i++) {
                    for(key in champion) {
                      if(champion.hasOwnProperty(key) && champion[key].key == match1_bannedChamp[i]) {
                        match1_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                      if(champion.hasOwnProperty(key) && champion[key].key == match1_selectedChamp[i]) {
                        match1_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                    }
                  }
  
                  for(var i=0; i<20; i++) {
                    for(key in spell){
                      if(spell.hasOwnProperty(key) && spell[key].key == match1_spellId[i]){
                        match1_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/"+spell[key].id+".png");
                      }
                    }
                  }
                  
                  var match1 = {
                    "summonerName" : match1_summonerName,
                    "selectedChamp_image" : match1_selectedChamp_image,
                    "bannedChamp_image" : match1_bannedChamp_image,
                    "spell_image" : match1_spell_image,
                    "kda" : match1_kda
                  };

                var match2Url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + match_gameId[1] + "?api_key=" + apikey;
                request(match2Url,function(error,response,body){
                  var match2_json = JSON.parse(body);
                  var match2_gameLength = match_json.gameDuration;
                  var match2_teams = match2_json.teams;
                  var match2_participants = match2_json.participants;
                  var match2_participantIdentities = match2_json.participantIdentities;

                  var match2_bannedChamp = new Array();
                  var match2_selectedChamp = new Array();
                  var match2_spellId = new Array();
                  var match2_summonerName = new Array();
                  var match2_kda = new Array();

                  var match2_bannedChamp_image = new Array();
                  var match2_selectedChamp_image = new Array();
                  var match2_spell_image = new Array();

                  for(var i=0; i<2; i++){
                    var temp = match2_teams[i].bans;
                    for(var j=0; j<5; j++){
                      match2_bannedChamp.push(temp[j].championId);
                    }
                  }

                  for(var i=0; i<10; i++){
                    match2_selectedChamp.push(match2_participants[i].championId);
                    match2_spellId.push(match2_participants[i].spell1Id);
                    match2_spellId.push(match2_participants[i].spell2Id);
                    match2_summonerName.push((match2_participantIdentities[i].player).summonerName);
                    var obj = {
                      'k' : (match2_participants[i].stats).kills,
                      'd' : (match2_participants[i].stats).deaths,
                      'a' : (match2_participants[i].stats).assists
                    };
                    match2_kda.push(obj);
                  }

                  for(var i=0; i<10; i++) {
                    for(key in champion) {
                      if(champion.hasOwnProperty(key) && champion[key].key == match2_bannedChamp[i]) {
                        match2_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                      if(champion.hasOwnProperty(key) && champion[key].key == match2_selectedChamp[i]) {
                        match2_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                    }
                  }
  
                  for(var i=0; i<20; i++) {
                    for(key in spell){
                      if(spell.hasOwnProperty(key) && spell[key].key == match2_spellId[i]){
                        match2_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/"+spell[key].id+".png");
                      }
                    }
                  }
                  
                  var match2 = {
                    "summonerName" : match2_summonerName,
                    "selectedChamp_image" : match2_selectedChamp_image,
                    "bannedChamp_image" : match2_bannedChamp_image,
                    "spell_image" : match2_spell_image,
                    "kda" : match2_kda
                  };


                var match3Url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + match_gameId[2] + "?api_key=" + apikey;
                request(match3Url,function(error,response,body){
                  var match3_json = JSON.parse(body);
                  var match3_gameLength = match_json.gameDuration;
                  var match3_teams = match3_json.teams;
                  var match3_participants = match3_json.participants;
                  var match3_participantIdentities = match3_json.participantIdentities;

                  var match3_bannedChamp = new Array();
                  var match3_selectedChamp = new Array();
                  var match3_spellId = new Array();
                  var match3_summonerName = new Array();
                  var match3_kda = new Array();

                  var match3_bannedChamp_image = new Array();
                  var match3_selectedChamp_image = new Array();
                  var match3_spell_image = new Array();

                  for(var i=0; i<2; i++){
                    var temp = match3_teams[i].bans;
                    for(var j=0; j<5; j++){
                      match3_bannedChamp.push(temp[j].championId);
                    }
                  }

                  for(var i=0; i<10; i++){
                    match3_selectedChamp.push(match3_participants[i].championId);
                    match3_spellId.push(match3_participants[i].spell1Id);
                    match3_spellId.push(match3_participants[i].spell2Id);
                    match3_summonerName.push((match3_participantIdentities[i].player).summonerName);
                    var obj = {
                      'k' : (match3_participants[i].stats).kills,
                      'd' : (match3_participants[i].stats).deaths,
                      'a' : (match3_participants[i].stats).assists
                    };
                    match3_kda.push(obj);
                  }

                  for(var i=0; i<10; i++) {
                    for(key in champion) {
                      if(champion.hasOwnProperty(key) && champion[key].key == match3_bannedChamp[i]) {
                        match3_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                      if(champion.hasOwnProperty(key) && champion[key].key == match3_selectedChamp[i]) {
                        match3_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                    }
                  }
  
                  for(var i=0; i<20; i++) {
                    for(key in spell){
                      if(spell.hasOwnProperty(key) && spell[key].key == match3_spellId[i]){
                        match3_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/"+spell[key].id+".png");
                      }
                    }
                  }
                  
                  var match3 = {
                    "summonerName" : match3_summonerName,
                    "selectedChamp_image" : match3_selectedChamp_image,
                    "bannedChamp_image" : match3_bannedChamp_image,
                    "spell_image" : match3_spell_image,
                    "kda" : match3_kda
                  };


                var match4Url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + match_gameId[3] + "?api_key=" + apikey;
                request(match4Url,function(error,response,body){
                  var match4_json = JSON.parse(body);
                  var match4_gameLength = match_json.gameDuration;
                  var match4_teams = match4_json.teams;
                  var match4_participants = match4_json.participants;
                  var match4_participantIdentities = match4_json.participantIdentities;

                  var match4_bannedChamp = new Array();
                  var match4_selectedChamp = new Array();
                  var match4_spellId = new Array();
                  var match4_summonerName = new Array();
                  var match4_kda = new Array();

                  var match4_bannedChamp_image = new Array();
                  var match4_selectedChamp_image = new Array();
                  var match4_spell_image = new Array();

                  for(var i=0; i<2; i++){
                    var temp = match4_teams[i].bans;
                    for(var j=0; j<5; j++){
                      match4_bannedChamp.push(temp[j].championId);
                    }
                  }

                  for(var i=0; i<10; i++){
                    match4_selectedChamp.push(match4_participants[i].championId);
                    match4_spellId.push(match4_participants[i].spell1Id);
                    match4_spellId.push(match4_participants[i].spell2Id);
                    match4_summonerName.push((match4_participantIdentities[i].player).summonerName);
                    var obj = {
                      'k' : (match4_participants[i].stats).kills,
                      'd' : (match4_participants[i].stats).deaths,
                      'a' : (match4_participants[i].stats).assists
                    };
                    match4_kda.push(obj);
                  }

                  for(var i=0; i<10; i++) {
                    for(key in champion) {
                      if(champion.hasOwnProperty(key) && champion[key].key == match4_bannedChamp[i]) {
                        match4_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                      if(champion.hasOwnProperty(key) && champion[key].key == match4_selectedChamp[i]) {
                        match4_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                    }
                  }
  
                  for(var i=0; i<20; i++) {
                    for(key in spell){
                      if(spell.hasOwnProperty(key) && spell[key].key == match4_spellId[i]){
                        match4_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/"+spell[key].id+".png");
                      }
                    }
                  }
                  
                  var match4 = {
                    "summonerName" : match4_summonerName,
                    "selectedChamp_image" : match4_selectedChamp_image,
                    "bannedChamp_image" : match4_bannedChamp_image,
                    "spell_image" : match4_spell_image,
                    "kda" : match4_kda
                  };


                var match5Url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + match_gameId[4] + "?api_key=" + apikey;
                request(match5Url,function(error,response,body){
                  var match5_json = JSON.parse(body);
                  var match5_gameLength = match_json.gameDuration;
                  var match5_teams = match5_json.teams;
                  var match5_participants = match5_json.participants;
                  var match5_participantIdentities = match5_json.participantIdentities;

                  var match5_bannedChamp = new Array();
                  var match5_selectedChamp = new Array();
                  var match5_spellId = new Array();
                  var match5_summonerName = new Array();
                  var match5_kda = new Array();

                  var match5_bannedChamp_image = new Array();
                  var match5_selectedChamp_image = new Array();
                  var match5_spell_image = new Array();

                  for(var i=0; i<2; i++){
                    var temp = match5_teams[i].bans;
                    for(var j=0; j<5; j++){
                      match5_bannedChamp.push(temp[j].championId);
                    }
                  }

                  for(var i=0; i<10; i++){
                    match5_selectedChamp.push(match5_participants[i].championId);
                    match5_spellId.push(match5_participants[i].spell1Id);
                    match5_spellId.push(match5_participants[i].spell2Id);
                    match5_summonerName.push((match5_participantIdentities[i].player).summonerName);
                    var obj = {
                      'k' : (match5_participants[i].stats).kills,
                      'd' : (match5_participants[i].stats).deaths,
                      'a' : (match5_participants[i].stats).assists
                    };
                    match5_kda.push(obj);
                  }

                  for(var i=0; i<10; i++) {
                    for(key in champion) {
                      if(champion.hasOwnProperty(key) && champion[key].key == match5_bannedChamp[i]) {
                        match5_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                      if(champion.hasOwnProperty(key) && champion[key].key == match5_selectedChamp[i]) {
                        match5_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+champion[key].id+".png");
                      }
                    }
                  }
  
                  for(var i=0; i<20; i++) {
                    for(key in spell){
                      if(spell.hasOwnProperty(key) && spell[key].key == match5_spellId[i]){
                        match5_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/"+spell[key].id+".png");
                      }
                    }
                  }
                  
                  var match5 = {
                    "summonerName" : match5_summonerName,
                    "selectedChamp_image" : match5_selectedChamp_image,
                    "bannedChamp_image" : match5_bannedChamp_image,
                    "spell_image" : match5_spell_image,
                    "kda" : match5_kda
                  };

                  var summoner_info = {
                    "summoner_Name" : summoner,
                    "summoner_tierimage" : img_tier,
                    "summoner_tier" : tier,
                    "summoner_rank" : rank,
                    "summoner_leaguepoint" : leaguePoints,
                    "summoner_wins" : wins,
                    "summoner_losses" : losses,
                    "summoner_winrate" : ((wins/(wins+losses))*100).toFixed(2),
                    "summoner_carry" : (wins/losses*2).toFixed(2)
                  };

                  var rotation_info = {
                    "rotation_image" : rotation_pic,
                    "rotation_image_newbie" : rotation_pic_newbie
                  };

                  var total_info = {
                    "Summoner_info" : summoner_info,
                    "Rotation_info" : rotation_info,
                    "Spectator_flag" : flag,
                    "Spectator" : spectator,
                    "Match1" : match1,
                    "Match2" : match2,
                    "Match3" : match3,
                    "Match4" : match4,
                    "Match5" : match5
                  };

                  console.log(total_info);


                  res.render('index', { title: req.params.username ,
                  c_id: champ_id,
                  c_name: champ_name,
                  c_point: champ_point,
                  c_pic: champ_pic,
                  c_rotation : rotation_pic,
                  c_rotation_newbie : rotation_pic_newbie,
                  c_summoner: summoner,
                  c_wins: wins,
                  c_losses: losses,
                  c_tier: tier,
                  c_imgtier: img_tier,
                  c_rank: rank,
                  c_leaguePoint: leaguePoints
                  });

                });
                });
                });
                });
                });
              });
             });
            });
            });
          });
        });
      });
        });
      });
    };
    