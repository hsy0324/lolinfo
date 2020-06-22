module.exports = function (app) {

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
  var champion;
  var champ_count = 0;
  var spell;

  app.get('/main', function (req, res) {
    var rotation_name = new Array();
    var rotation_name_newbie = new Array();
    var rotation_pic = new Array();
    var rotation_pic_newbie = new Array();

    var rotationUrl = "https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=" + apikey;
    request(rotationUrl, function (error, response, body) {
      var info_rotation = JSON.parse(body);
      var keys = Object.keys(info_rotation);
      for (var k = 0; k < info_rotation[keys[0]].length; k++)
        rotation_champ[k] = info_rotation[keys[0]][k];
      for (var k = 0; k < info_rotation[keys[1]].length; k++)
        rotation_champ_newbie[k] = info_rotation[keys[1]][k];


      var staticUrl = "http://ddragon.leagueoflegends.com/cdn/10.11.1/data/en_US/champion.json";
      request(staticUrl, function (error, response, body) {
        var info_static_champ_json = JSON.parse(body);
        champion = info_static_champ_json["data"];

        for (var name in champion) {
          if (champion.hasOwnProperty(name)) {
            champ_count++;
          }
        }

        for (var i = 0; i < champ_count; i++) {
          for (js in champion) {
            for (j in champion[js]) {
              if (champion[js]["key"] == rotation_champ[i]) {
                rotation_name[i] = champion[js]["id"];
                rotation_pic[i] = "http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + rotation_name[i] + ".png";
              }
              if (champion[js]["key"] == rotation_champ_newbie[i]) {
                rotation_name_newbie[i] = champion[js]["id"]
                rotation_pic_newbie[i] = "http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + rotation_name_newbie[i] + ".png";
              }
            }
          }
        }
        res.send({
          title: 'LOL INFO',
          c_rotation: rotation_pic,
          c_rotation_newbie: rotation_pic_newbie
        });
      });
    });
  });


  app.get('/search/:username/', function (req, res, next) {
    //롤 api url
    name = req.params.username;
    var nameUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + urlenconde(name) + "?api_key=" + apikey;
    request(nameUrl, function (error, response, body) {

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


      var spellUrl = "http://ddragon.leagueoflegends.com/cdn/10.12.1/data/en_US/summoner.json";
      request(spellUrl, function (error, response, body) {
        spell = (JSON.parse(body)).data;


        var userLeagueUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/" + urlenconde(id) + "?api_key=" + apikey;
        request(userLeagueUrl, function (error, response, body) {
          var info_user_league_json = JSON.parse(body);
          if (info_user_league_json[0] != null) {
            var wins = info_user_league_json[0]["wins"];
            var losses = info_user_league_json[0]["losses"];
            var tier = info_user_league_json[0]["tier"];
            var rank = info_user_league_json[0]["rank"];
            var leaguePoints = info_user_league_json[0]["leaguePoints"];
            var img_tier;
            if (tier == "MASTER") {
              img_tier = "/ranked-emblems/Emblem_Master.png";
            } else if (tier == "CHALLENGER") {
              img_tier = "/ranked-emblems/Emblem_Challenger.png";
            } else if (tier == "DIAMOND") {
              img_tier = "/ranked-emblems/Emblem_Diamond.png"
            } else if (tier == "PLATINUM") {
              img_tier = "/ranked-emblems/Emblem_Platinum.png"
            } else if (tier == "GRANDMASTER") {
              img_tier = "/ranked-emblems/Emblem_Grandmaster.png"
            } else if (tier == "GOLD") {
              img_tier = "/ranked-emblems/Emblem_Gold.png"
            } else if (tier == "SILVER") {
              img_tier = "/ranked-emblems/Emblem_Silver.png"
            } else if (tier == "BRONZE") {
              img_tier = "/ranked-emblems/Emblem_Bronze.png"
            } else {
              img_tier = "/ranked-emblems/Emblem_Iron.png"
            }
            res.send({
              title: req.params.username,
              c_summoner: summoner,
              c_wins: wins,
              c_losses: losses,
              c_tier: tier,
              c_imgtier: img_tier,
              c_rank: rank,
              c_leaguePoint: leaguePoints
            });
          }
        });
      });
    });
  });


  app.get('/search/:username/spectator', function (req, res, next) {
    if (true) {
      console.log(id);
      var spectatorUrl = "https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + urlenconde(id) + "?api_key=" + apikey;
      request(spectatorUrl, function (error, response, body) {
        var flag = true;  // 실시간 경기 여부

        if (response.statusCode != 200)
          flag = false;

        var spectator;
        if (flag) {  // 실시간 경기 진행중이면
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
          for (var i = 0; i < 10; i++) {
            spec_summonerName.push(spec_participants[i].summonerName);
            spec_spellId.push(spec_participants[i].spell1Id);
            spec_spellId.push(spec_participants[i].spell2Id);
          }

          for (var i = 0; i < 10; i++) {
            for (key in champion) {
              if (champion.hasOwnProperty(key) && champion[key].key == spec_bannedChamp[i].championId) {
                spec_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + champion[key].id + ".png");
              }
              if (champion.hasOwnProperty(key) && champion[key].key == spec_participants[i].championId) {
                spec_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + champion[key].id + ".png");
              }
            }
          }

          for (var i = 0; i < 20; i++) {
            for (key in spell) {
              if (spell.hasOwnProperty(key) && spell[key].key == spec_spellId[i]) {
                spec_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/" + spell[key].id + ".png");
              }
            }
          }

          spectator = {
            "summonerName": spec_summonerName,
            "selectedChamp_image": spec_selectedChamp_image,
            "bannedChamp_image": spec_bannedChamp_image,
            "spell_image": spec_spell_image
          };
        }
        console.log(flag);
        console.log(spectator);
        res.send({
          flag: flag,
          spectator: spectator
        });
      });
    }
    else {
      res.send();
    }
  });

  var match = new Array();
  app.get('/search/:username/match', function (req, res, next) {
    // 게임정보 불러오기
    var matchUrl = "https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountId + "?api_key=" + apikey;
    request(matchUrl, function (error, response, body) {
      var match_json = JSON.parse(body).matches;

      var match_gameId = new Array();
      var match_mychamp = new Array();

      var count = 0, idx = 0;
      while (count < 5) {
        // 420 : 5x5 솔로랭크, 440 : 5x5 자유랭크
        if (match_json[idx].queue == 420 || match_json[idx].queue == 440) {
          match_gameId.push(match_json[idx].gameId);
          match_mychamp.push(match_json[idx].champion);
          count++;
        }
        idx++;
      }



      for (var i = 0; i < 5; i++) {
        // teamId: 100 = Blue , teamId:200 = Red
        var match1Url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + match_gameId[i] + "?api_key=" + apikey;
        request(match1Url, function (error, response, body) {
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

          for (var i = 0; i < 2; i++) {
            var temp = match1_teams[i].bans;
            for (var j = 0; j < 5; j++) {
              match1_bannedChamp.push(temp[j].championId);
            }
          }

          for (var i = 0; i < 10; i++) {
            match1_selectedChamp.push(match1_participants[i].championId);
            match1_spellId.push(match1_participants[i].spell1Id);
            match1_spellId.push(match1_participants[i].spell2Id);
            match1_summonerName.push((match1_participantIdentities[i].player).summonerName);
            var obj = {
              'k': (match1_participants[i].stats).kills,
              'd': (match1_participants[i].stats).deaths,
              'a': (match1_participants[i].stats).assists
            };
            match1_kda.push(obj);
          }

          for (var i = 0; i < 10; i++) {
            for (key in champion) {
              if (champion.hasOwnProperty(key) && champion[key].key == match1_bannedChamp[i]) {
                match1_bannedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + champion[key].id + ".png");
              }
              if (champion.hasOwnProperty(key) && champion[key].key == match1_selectedChamp[i]) {
                match1_selectedChamp_image.push("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + champion[key].id + ".png");
              }
            }
          }

          for (var i = 0; i < 20; i++) {
            for (key in spell) {
              if (spell.hasOwnProperty(key) && spell[key].key == match1_spellId[i]) {
                match1_spell_image.push("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/spell/" + spell[key].id + ".png");
              }
            }
          }

          
          var match_temp = {
            "summonerName": match1_summonerName,
            "selectedChamp_image": match1_selectedChamp_image,
            "bannedChamp_image": match1_bannedChamp_image,
            "spell_image": match1_spell_image,
            "kda": match1_kda
          };

          match.push(match_temp);
        });
      }
      console.log(match);
      res.send({
        match: match
      });
    });
  });
}