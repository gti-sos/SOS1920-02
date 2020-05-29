<p> <strong> Insertar API Externa 1 </strong> </p>

<main>

    <div style="padding-top:5%; padding-bottom: 5%">
        <!-- CONTAINER -->
        <div class="container" style="background-color: rgb(46, 49, 49);padding:1% 1% 1% 1%; border-radius: 20px;box-shadow: 0px 0px 16px -2px rgba(0,0,0,0.52);">
            <div style="padding-bottom:2%;">
                <a href="#!/integrations/chuckNorris" ng-click="refresh()"><img style="display: block;margin-left: auto;margin-right: auto;" src="../../../img/chucknorris.png"></img></a>
                <p align="center" style="color: white">NOTA: Para otra historia, pulsar a Chuck Norris.</p>
                </br>
                </br>
                <div class="table-responsive-xl" style="background-color:white;">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">
                                    Historia real de Chuck Norris:
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {{datos}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main>    